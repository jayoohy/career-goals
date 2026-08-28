'use client';

import { JobReadyBadge } from '@/components/JobReadyBadge';
import { PathProgressMap } from '@/components/PathProgressMap';
import { SegmentedProgressBars } from '@/components/SegmentedProgressBars';
import { WeeklyReviewCard } from '@/components/WeeklyReviewCard';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useMilestone } from '@/hooks/useMilestone';
import { useRoadmap } from '@/hooks/useRoadmap';
import { useStreak } from '@/hooks/useStreak';
import { useWeeklyReview } from '@/hooks/useWeeklyReview';

export default function ProgressPage() {
  const { sections } = useCourseSections();
  const { progressBySection } = useCourseProgress();
  const { groupProgress } = useRoadmap();
  const { streak } = useStreak();
  const { totalStudiedMinutes } = useDailyLog();
  const { jobReady } = useMilestone();
  const { data: weeklyReview } = useWeeklyReview();

  const courseComplete =
    sections.length > 0 && sections.every((s) => s.status === 'done' || s.status === 'skipped');
  const totalHours = Math.round((totalStudiedMinutes / 60) * 10) / 10;

  const lessonTotals = Object.values(progressBySection).reduce(
    (acc, p) => ({ done: acc.done + p.done, total: acc.total + p.total }),
    { done: 0, total: 0 },
  );
  const layer1Percent = lessonTotals.total > 0 ? Math.round((lessonTotals.done / lessonTotals.total) * 100) : 0;

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-6 px-6 pb-10">
      <h1 className="-mb-2 font-heading text-3xl font-bold">Progress</h1>

      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4">
        <div className="flex justify-between">
          <span className="text-sm text-text-secondary">Current streak</span>
          <span className="font-heading font-semibold">{streak?.currentStreak ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-text-secondary">Longest streak</span>
          <span className="font-heading font-semibold">{streak?.longestStreak ?? 0}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-text-secondary">Total hours logged</span>
          <span className="font-heading font-semibold">{totalHours}h</span>
        </div>
      </div>

      <JobReadyBadge jobReady={jobReady} />

      <PathProgressMap courseComplete={courseComplete} jobReady={jobReady} />

      <SegmentedProgressBars
        layer1Percent={layer1Percent}
        layer1Detail={`${lessonTotals.done}/${lessonTotals.total} videos`}
        groupProgress={groupProgress}
      />

      <WeeklyReviewCard data={weeklyReview} />
    </main>
  );
}
