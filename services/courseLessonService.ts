import { db } from '@/services/db';
import type { CourseLesson } from '@/types/models';

export async function getLessonsForSection(sectionId: string): Promise<CourseLesson[]> {
  return db.courseLessons.where('sectionId').equals(sectionId).sortBy('order');
}

export async function toggleLesson(lessonId: string, done: boolean): Promise<void> {
  await db.courseLessons.update(lessonId, { done });
}

/** Marks every given lesson done in one action — the "already know this" bulk-mark flow (PRD §4.1), now applied to real lesson numbers instead of invented sub-group names. */
export async function bulkMarkLessonsDone(lessonIds: string[]): Promise<void> {
  await db.courseLessons.bulkUpdate(lessonIds.map((id) => ({ key: id, changes: { done: true } })));
}
