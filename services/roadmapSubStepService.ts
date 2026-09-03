import { db } from '@/services/db';
import { recomputeRoadmapItemStatus } from '@/services/roadmapService';
import type { RoadmapSubStep } from '@/types/models';
import { generateId } from '@/utils/id';

export async function getSubStepsForItem(itemId: string): Promise<RoadmapSubStep[]> {
  return db.roadmapSubSteps.where('itemId').equals(itemId).sortBy('order');
}

export async function toggleSubStep(subStepId: string, done: boolean): Promise<void> {
  const step = await db.roadmapSubSteps.get(subStepId);
  if (!step) return;
  await db.roadmapSubSteps.update(subStepId, { done });
  await recomputeRoadmapItemStatus(step.itemId);
}

/** Adds a step Joy typed herself, always at the end of the item's checklist. */
export async function addSubStep(itemId: string, title: string): Promise<RoadmapSubStep> {
  const trimmed = title.trim();
  if (!trimmed) throw new Error('A step needs a title.');

  const last = await db.roadmapSubSteps.where('itemId').equals(itemId).last();
  const step: RoadmapSubStep = {
    id: generateId('roadmap-step'),
    itemId,
    title: trimmed,
    order: (last?.order ?? 0) + 1,
    done: false,
    seeded: false,
  };
  await db.roadmapSubSteps.add(step);
  await recomputeRoadmapItemStatus(itemId);
  return step;
}

export async function renameSubStep(subStepId: string, title: string): Promise<void> {
  const trimmed = title.trim();
  if (!trimmed) return;
  await db.roadmapSubSteps.update(subStepId, { title: trimmed });
}

/** Removes a step and closes the gap in `order` so the checklist stays contiguous. */
export async function deleteSubStep(subStepId: string): Promise<void> {
  const step = await db.roadmapSubSteps.get(subStepId);
  if (!step) return;

  await db.transaction('rw', db.roadmapSubSteps, async () => {
    await db.roadmapSubSteps.delete(subStepId);
    const remaining = await db.roadmapSubSteps.where('itemId').equals(step.itemId).sortBy('order');
    for (let i = 0; i < remaining.length; i += 1) {
      if (remaining[i].order !== i + 1) {
        await db.roadmapSubSteps.update(remaining[i].id, { order: i + 1 });
      }
    }
  });
  await recomputeRoadmapItemStatus(step.itemId);
}

/**
 * Ticks off checklist steps to match the time already logged against a roadmap item — the
 * Layer 2 version of `syncLessonsToLoggedTime`. Estimated hours ÷ step count gives a rough
 * "minutes per step"; only ever checks boxes, never un-checks one Joy ticked herself.
 */
export async function syncSubStepsToLoggedTime(
  itemId: string,
  minutesLogged: number,
): Promise<void> {
  const item = await db.roadmapItems.get(itemId);
  if (!item || item.estimatedHours <= 0) return;

  const steps = await getSubStepsForItem(itemId);
  if (steps.length === 0) return;

  const minutesPerStep = (item.estimatedHours * 60) / steps.length;
  const covered = Math.min(steps.length, Math.floor(minutesLogged / minutesPerStep));
  if (covered <= 0) return;

  const toCheck = steps
    .slice(0, covered)
    .filter((step) => !step.done)
    .map((step) => step.id);
  if (toCheck.length === 0) return;

  await db.roadmapSubSteps.bulkUpdate(toCheck.map((id) => ({ key: id, changes: { done: true } })));
  await recomputeRoadmapItemStatus(itemId);
}
