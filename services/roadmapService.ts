import { isLayer1Complete } from '@/services/courseSectionService';
import { db } from '@/services/db';
import type {
  RoadmapItem,
  RoadmapItemStatus,
  RoadmapSectionGroup,
  RoadmapSource,
} from '@/types/models';
import { generateId } from '@/utils/id';

export async function getAllRoadmapItems(): Promise<RoadmapItem[]> {
  return db.roadmapItems.orderBy('sequencePosition').toArray();
}

export async function getRoadmapItemById(id: string): Promise<RoadmapItem | null> {
  return (await db.roadmapItems.get(id)) ?? null;
}

/**
 * Recomputes an item's status from its sub-steps — all done → done, any done → in_progress,
 * none → not_started. Mirrors `recomputeSectionStatus`. Two carve-outs:
 *  - an item with no sub-steps keeps whatever status it has (the detail page gives it a manual
 *    done / not-done toggle instead);
 *  - 'deferred' is only cleared once at least one sub-step is checked (checking something is
 *    Joy re-engaging with it), otherwise a deferred item stays deferred.
 */
export async function recomputeRoadmapItemStatus(itemId: string): Promise<void> {
  const item = await db.roadmapItems.get(itemId);
  if (!item) return;

  const steps = await db.roadmapSubSteps.where('itemId').equals(itemId).toArray();
  if (steps.length === 0) return;

  const doneCount = steps.filter((step) => step.done).length;
  const status: RoadmapItemStatus =
    doneCount === steps.length
      ? 'done'
      : doneCount > 0
        ? 'in_progress'
        : item.status === 'deferred'
          ? 'deferred'
          : 'not_started';

  if (status !== item.status) {
    await db.roadmapItems.update(itemId, { status });
  }
}

export interface RoadmapItemProgress {
  done: number;
  total: number;
}

/** done/total sub-step counts per item — for the progress bar on each roadmap list card. */
export async function getSubStepProgressByItem(): Promise<Record<string, RoadmapItemProgress>> {
  const steps = await db.roadmapSubSteps.toArray();
  const byItem: Record<string, RoadmapItemProgress> = {};
  for (const step of steps) {
    const entry = byItem[step.itemId] ?? { done: 0, total: 0 };
    entry.total += 1;
    if (step.done) entry.done += 1;
    byItem[step.itemId] = entry;
  }
  return byItem;
}

/** Derived, not stored (PRD §8) — recomputed from CourseSection state on every read. */
export async function isRoadmapUnlocked(): Promise<boolean> {
  return isLayer1Complete();
}

export async function updateRoadmapItemStatus(
  id: string,
  status: RoadmapItemStatus,
): Promise<void> {
  await db.roadmapItems.update(id, { status });
}

export async function deferRoadmapItem(id: string): Promise<void> {
  await updateRoadmapItemStatus(id, 'deferred');
}

/**
 * Removes a roadmap item and closes the gap in `sequencePosition` so ordering stays contiguous.
 * Any item can be removed (the list is Joy's plan, not a fixed spec) — the job-ready calculation
 * simply has one fewer threshold item to satisfy afterwards, which is the intended behaviour.
 */
export async function deleteRoadmapItem(id: string): Promise<void> {
  await db.transaction('rw', db.roadmapItems, async () => {
    await db.roadmapItems.delete(id);
    const remaining = await db.roadmapItems.orderBy('sequencePosition').toArray();
    for (let i = 0; i < remaining.length; i += 1) {
      if (remaining[i].sequencePosition !== i + 1) {
        await db.roadmapItems.update(remaining[i].id, { sequencePosition: i + 1 });
      }
    }
  });
}

/**
 * Persists a full reorder. Callers (UI) must only invoke this once `isRoadmapUnlocked()` is
 * true — per §4.2, `sequence_position` is read-only in the UI until Layer 1 is complete.
 */
export async function reorderRoadmapItems(orderedIds: string[]): Promise<void> {
  await db.transaction('rw', db.roadmapItems, async () => {
    for (let i = 0; i < orderedIds.length; i += 1) {
      await db.roadmapItems.update(orderedIds[i], { sequencePosition: i + 1 });
    }
  });
}

export interface NewRoadmapItemInput {
  title: string;
  source: RoadmapSource;
  sectionGroup: RoadmapSectionGroup;
  description: string;
  estimatedHours: number;
}

/**
 * Appends a new user-added item to the end of the sequence — allowed at any time, per §4.2.
 * User-added items are never job-ready-floor items (that floor is curated, §4.3) and default
 * to non-ongoing.
 */
export async function addRoadmapItem(input: NewRoadmapItemInput): Promise<RoadmapItem> {
  const maxPosition = await db.roadmapItems.orderBy('sequencePosition').last();
  const nextPosition = (maxPosition?.sequencePosition ?? 0) + 1;
  const item: RoadmapItem = {
    id: generateId('roadmap'),
    title: input.title,
    source: input.source,
    sectionGroup: input.sectionGroup,
    description: input.description,
    estimatedHours: input.estimatedHours,
    sequencePosition: nextPosition,
    status: 'not_started',
    isOngoing: false,
    jobReadyThreshold: false,
    userAdded: true,
  };

  await db.roadmapItems.add(item);
  return item;
}

export interface SectionGroupProgress {
  sectionGroup: RoadmapSectionGroup;
  total: number;
  done: number;
  percent: number; // 0-100, rounded
}

/**
 * Per-group completion for the segmented progress bars (PRD §6, post-v2) — one bar per
 * `section_group` rather than a single flat Layer 2 percentage. Groups with no items are
 * omitted rather than shown as a misleading 0/0.
 */
export async function getSectionGroupProgress(): Promise<SectionGroupProgress[]> {
  const items = await getAllRoadmapItems();
  const byGroup = new Map<RoadmapSectionGroup, RoadmapItem[]>();
  for (const item of items) {
    const group = byGroup.get(item.sectionGroup) ?? [];
    group.push(item);
    byGroup.set(item.sectionGroup, group);
  }

  return Array.from(byGroup.entries()).map(([sectionGroup, groupItems]) => {
    const total = groupItems.length;
    const done = groupItems.filter((item) => item.status === 'done').length;
    return {
      sectionGroup,
      total,
      done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  });
}
