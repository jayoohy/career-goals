import { db } from '@/services/db';
import type { CourseSection, CourseSectionStatus } from '@/types/models';

export async function getAllCourseSections(): Promise<CourseSection[]> {
  return db.courseSections.orderBy('sortOrder').toArray();
}

export async function getCourseSectionById(id: string): Promise<CourseSection | null> {
  const section = await db.courseSections.get(id);
  return section ?? null;
}

/**
 * Updates a section's status. This is also the entry point for Section 1's "skim" bulk-mark
 * action (§4.1) — the app has no per-sub-group persistence, since the PRD data model tracks
 * completion at the section level only. The Course screen groups Section 1's videos into
 * named sub-groups purely as a UI affordance and calls this same function once the user
 * decides the section (or enough of it) is known.
 */
export async function updateCourseSectionStatus(
  id: string,
  status: CourseSectionStatus,
): Promise<void> {
  await db.courseSections.update(id, { status });
}

/** Derived per PRD §4.2/§8: true once every non-skipped section is done. */
export async function isLayer1Complete(): Promise<boolean> {
  const remaining = await db.courseSections
    .filter((section) => section.status !== 'done' && section.status !== 'skipped')
    .count();
  return remaining === 0;
}
