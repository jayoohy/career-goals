import { courseSectionsSeed } from '@/data/seed/courseSections';
import type { CourseLesson } from '@/types/models';

/**
 * Per-lesson checklist rows, generated from each section's `videoCount`. The real Udemy lecture
 * titles weren't fetchable (the course page returned 403), so lessons are honestly labeled
 * "Video N of total" rather than invented specific titles — still gives real per-video tracking,
 * just without pretending to know exact lecture names.
 */
export const courseLessonsSeed: CourseLesson[] = courseSectionsSeed.flatMap((section) =>
  Array.from({ length: section.videoCount }, (_, i) => ({
    id: `${section.id}-lesson-${i + 1}`,
    sectionId: section.id,
    title: `Video ${i + 1} of ${section.videoCount}`,
    order: i + 1,
    done: false,
  })),
);
