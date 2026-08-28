'use client';

import { useCallback, useEffect, useState } from 'react';

import { getCourseMeta } from '@/services/courseMetaService';
import { db } from '@/services/db';
import type { CourseMeta } from '@/types/models';

export interface SectionLessonProgress {
  done: number;
  total: number;
}

/** Course-tab-level data: the course header info, plus a done/total lesson count per section (for the section list's real progress display — previously always showed 0%). */
export function useCourseProgress() {
  const [meta, setMeta] = useState<CourseMeta | null>(null);
  const [progressBySection, setProgressBySection] = useState<Record<string, SectionLessonProgress>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [courseMeta, lessons] = await Promise.all([getCourseMeta(), db.courseLessons.toArray()]);
      setMeta(courseMeta);

      const bySection: Record<string, SectionLessonProgress> = {};
      for (const lesson of lessons) {
        const entry = bySection[lesson.sectionId] ?? { done: 0, total: 0 };
        entry.total += 1;
        if (lesson.done) entry.done += 1;
        bySection[lesson.sectionId] = entry;
      }
      setProgressBySection(bySection);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { meta, progressBySection, loading, refresh };
}
