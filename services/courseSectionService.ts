import { db } from '@/services/db';
import type { CourseSection } from '@/types/models';

export async function getAllCourseSections(): Promise<CourseSection[]> {
  return db.courseSections.orderBy('sortOrder').toArray();
}

export async function getCourseSectionById(id: string): Promise<CourseSection | null> {
  const section = await db.courseSections.get(id);
  return section ?? null;
}

/**
 * Recomputes a section's status from its lessons — done once all lessons are checked, in_progress
 * once any are, not_started otherwise. Call after any lesson toggle. 'skipped' is the one
 * exception: it's an explicit action (see `skipSection`), overridden automatically the moment
 * any lesson gets checked (that's Joy engaging with it, so it isn't "skipped" anymore).
 */
export async function recomputeSectionStatus(sectionId: string): Promise<void> {
  const section = await db.courseSections.get(sectionId);
  if (!section) return;

  const lessons = await db.courseLessons.where('sectionId').equals(sectionId).toArray();
  const doneCount = lessons.filter((lesson) => lesson.done).length;

  const status =
    lessons.length > 0 && doneCount === lessons.length
      ? 'done'
      : doneCount > 0
        ? 'in_progress'
        : section.status === 'skipped'
          ? 'skipped'
          : 'not_started';

  await db.courseSections.update(sectionId, { status });
}

/** Bumps a not-started section to in_progress the moment time is logged against it — fixes the earlier bug where logging hours never moved the section (or the Progress tab's Layer 1 bar) off 0%. */
export async function markSectionTouchedByLogging(sectionId: string): Promise<void> {
  const section = await db.courseSections.get(sectionId);
  if (section?.status === 'not_started') {
    await db.courseSections.update(sectionId, { status: 'in_progress' });
  }
}

/** Explicit "skip this section" action — distinct from the derived not_started/in_progress/done states above. */
export async function skipSection(sectionId: string): Promise<void> {
  await db.courseSections.update(sectionId, { status: 'skipped' });
}

/** Derived per PRD §4.2/§8: true once every non-skipped section is done. */
export async function isLayer1Complete(): Promise<boolean> {
  const remaining = await db.courseSections
    .filter((section) => section.status !== 'done' && section.status !== 'skipped')
    .count();
  return remaining === 0;
}
