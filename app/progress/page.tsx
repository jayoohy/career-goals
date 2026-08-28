'use client';

import { JobReadyBadge } from '@/components/JobReadyBadge';
import { PathProgressMap } from '@/components/PathProgressMap';
import { SegmentedProgressBars } from '@/components/SegmentedProgressBars';
import { WeeklyReviewCard } from '@/components/WeeklyReviewCard';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useMilestone } from '@/hooks/useMilestone';
import { useRoadmap } from '@/hooks/useRoadmap';
import { useStreak } from '@/hooks/useStreak';
import { useWeeklyReview } from '@/hooks/useWeeklyReview';

export default function ProgressPage() {
  const { sections } = useCourseSections();
  const { groupProgress } = useRoadmap();
  const { streak } = useStreak();
  const { totalStudiedMinutes } = useDailyLog();
  const { jobReady } = useMilestone();
  const { data: weeklyReview } = useWeeklyReview();

  const courseComplete =
    sections.length > 0 && sections.every((s) => s.status === 'done' || s.status === 'skipped');
  const totalHours = Math.round((totalStudiedMinutes / 60) * 10) / 10;

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-6 px-6 pb-10">
      <h1 className="-mb-2 text-4xl font-semibold">Progress</h1>

      <div className="flex flex-col gap-2 rounded-2xl bg-background-element p-4">
        <div className="flex justify-between">
          <span className="text-sm text-text-secondary">Current streak</span>
          <span className="text-sm font-bold">{streak?.currentStreak ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-text-secondary">Longest streak</span>
          <span className="text-sm font-bold">{streak?.longestStreak ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-text-secondary">Total hours logged</span>
          <span className="text-sm font-bold">{totalHours}h</span>
        </div>
      </div>

      <JobReadyBadge jobReady={jobReady} />

      <PathProgressMap courseComplete={courseComplete} jobReady={jobReady} />

      <SegmentedProgressBars courseSections={sections} groupProgress={groupProgress} />

      <WeeklyReviewCard data={weeklyReview} />
    </main>
  );
}
