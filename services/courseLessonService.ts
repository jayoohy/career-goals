import { getCourseSectionById, recomputeSectionStatus } from '@/services/courseSectionService';
import { db } from '@/services/db';
import type { CourseLesson } from '@/types/models';

export async function getLessonsForSection(sectionId: string): Promise<CourseLesson[]> {
  return db.courseLessons.where('sectionId').equals(sectionId).sortBy('order');
}

/**
 * Ticks off videos to match the time already logged against a section, so logging study time
 * moves the checklist on its own instead of leaving every video unchecked (reported: "logging
 * hours should tick off videos"). Only ever checks boxes — never un-checks one Joy ticked
 * herself — and works from the top of the list down. `minutesLogged` is the running total for
 * the whole section, not just the latest session.
 */
export async function syncLessonsToLoggedTime(
  sectionId: string,
  minutesLogged: number,
): Promise<void> {
  const section = await getCourseSectionById(sectionId);
  if (!section || section.videoCount <= 0 || section.durationMinutes <= 0) return;

  const avgMinutesPerVideo = section.durationMinutes / section.videoCount;
  const covered = Math.min(section.videoCount, Math.floor(minutesLogged / avgMinutesPerVideo));
  if (covered <= 0) return;

  const lessons = await getLessonsForSection(sectionId);
  const toCheck = lessons
    .slice(0, covered)
    .filter((lesson) => !lesson.done)
    .map((lesson) => lesson.id);

  if (toCheck.length === 0) return;

  await db.courseLessons.bulkUpdate(toCheck.map((id) => ({ key: id, changes: { done: true } })));
  await recomputeSectionStatus(sectionId);
}

export async function toggleLesson(lessonId: string, done: boolean): Promise<void> {
  await db.courseLessons.update(lessonId, { done });
}

/** Marks every given lesson done in one action — the "already know this" bulk-mark flow (PRD §4.1), now applied to real lesson numbers instead of invented sub-group names. */
export async function bulkMarkLessonsDone(lessonIds: string[]): Promise<void> {
  await db.courseLessons.bulkUpdate(lessonIds.map((id) => ({ key: id, changes: { done: true } })));
}
