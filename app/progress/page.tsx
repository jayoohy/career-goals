'use client';

import { JobReadyBadge } from '@/components/JobReadyBadge';
import { FlameIcon } from '@/components/icons';
import { PathProgressMap } from '@/components/PathProgressMap';
import { SegmentedProgressBars } from '@/components/SegmentedProgressBars';
import { StatTile } from '@/components/StatTile';
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
  const currentStreak = streak?.currentStreak ?? 0;

  const lessonTotals = Object.values(progressBySection).reduce(
    (acc, p) => ({ done: acc.done + p.done, total: acc.total + p.total }),
    { done: 0, total: 0 },
  );
  const layer1Percent =
    lessonTotals.total > 0 ? Math.round((lessonTotals.done / lessonTotals.total) * 100) : 0;

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-6 px-6 pb-10">
      <h1 className="-mb-2 font-heading text-3xl font-bold">Progress</h1>

      <div className="flex gap-3">
        <StatTile
          label="day streak"
          value={String(currentStreak)}
          icon={<FlameIcon className="h-5 w-5 text-streak" />}
        />
        <StatTile label="longest" value={String(streak?.longestStreak ?? 0)} />
        <StatTile label="hours" value={`${totalHours}`} />
      </div>

      <JobReadyBadge jobReady={jobReady} />

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">Your path</h2>
        <PathProgressMap courseComplete={courseComplete} jobReady={jobReady} />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="font-heading text-lg font-semibold">By area</h2>
        <SegmentedProgressBars
          layer1Percent={layer1Percent}
          layer1Detail={`${lessonTotals.done}/${lessonTotals.total} videos`}
          groupProgress={groupProgress}
        />
      </section>

      <WeeklyReviewCard data={weeklyReview} />
    </main>
  );
}
