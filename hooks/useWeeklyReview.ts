'use client';

import { useCallback, useEffect, useState } from 'react';

import { getAllCourseSections } from '@/services/courseSectionService';
import { getLogsInRange } from '@/services/dailyLogService';
import { getLatestFlaggedAttempts } from '@/services/quizService';
import { getAllRoadmapItems, isRoadmapUnlocked } from '@/services/roadmapService';
import type { QuizAttempt } from '@/types/models';
import { addDaysToDateString, todayLocalDate } from '@/utils/dateUtils';

export interface FlaggedSection {
  title: string;
  attempt: QuizAttempt;
}

export interface WeeklyReviewData {
  daysLogged: number;
  totalHoursThisWeek: number;
  whatsNextLabel: string | null;
  flaggedSections: FlaggedSection[];
}

/** Sunday-evening summary data (PRD §7): days logged, hours, what's next, flagged quiz sections. */
export function useWeeklyReview() {
  const [data, setData] = useState<WeeklyReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const today = todayLocalDate();
      const start = addDaysToDateString(today, -6);
      const [logs, sections, roadmapItems, unlocked, flaggedAttempts] = await Promise.all([
        getLogsInRange(start, today),
        getAllCourseSections(),
        getAllRoadmapItems(),
        isRoadmapUnlocked(),
        getLatestFlaggedAttempts(),
      ]);

      const daysLogged = logs.filter((log) => log.type === 'studied' || log.type === 'rest').length;
      const totalMinutes = logs
        .filter((log) => log.type === 'studied')
        .reduce((sum, log) => sum + (log.durationMinutes ?? 0), 0);

      let whatsNextLabel: string | null = null;
      const nextSection = sections.find((s) => s.status !== 'done' && s.status !== 'skipped');
      if (nextSection) {
        whatsNextLabel = nextSection.title;
      } else if (unlocked) {
        const nextItem = roadmapItems
          .slice()
          .sort((a, b) => a.sequencePosition - b.sequencePosition)
          .find((item) => item.status !== 'done' && item.status !== 'deferred');
        whatsNextLabel = nextItem?.title ?? null;
      }

      const sectionById = new Map(sections.map((s) => [s.id, s]));
      const flaggedSections: FlaggedSection[] = flaggedAttempts.map((attempt) => ({
        title: sectionById.get(attempt.sectionId)?.title ?? attempt.sectionId,
        attempt,
      }));

      setData({
        daysLogged,
        totalHoursThisWeek: Math.round((totalMinutes / 60) * 10) / 10,
        whatsNextLabel,
        flaggedSections,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}
