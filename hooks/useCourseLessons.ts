'use client';

import { useCallback, useEffect, useState } from 'react';

import { bulkMarkLessonsDone, getLessonsForSection, toggleLesson } from '@/services/courseLessonService';
import { recomputeSectionStatus } from '@/services/courseSectionService';
import type { CourseLesson } from '@/types/models';

export function useCourseLessons(sectionId: string) {
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setLessons(await getLessonsForSection(sectionId));
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggle = useCallback(
    async (lessonId: string, done: boolean) => {
      await toggleLesson(lessonId, done);
      await recomputeSectionStatus(sectionId);
      await refresh();
    },
    [sectionId, refresh],
  );

  const bulkMarkDone = useCallback(
    async (lessonIds: string[]) => {
      await bulkMarkLessonsDone(lessonIds);
      await recomputeSectionStatus(sectionId);
      await refresh();
    },
    [sectionId, refresh],
  );

  return { lessons, loading, refresh, toggle, bulkMarkDone };
}
