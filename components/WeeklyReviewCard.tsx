import type { WeeklyReviewData } from '@/hooks/useWeeklyReview';

interface WeeklyReviewCardProps {
  data: WeeklyReviewData | null;
}

/** Sunday-evening summary (PRD §7) — days logged, hours, what's next, flagged quiz sections. */
export function WeeklyReviewCard({ data }: WeeklyReviewCardProps) {
  if (!data) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
      <p className="font-heading font-semibold">This week</p>
      <p className="text-sm text-text-secondary">
        {data.daysLogged} day{data.daysLogged === 1 ? '' : 's'} logged · {data.totalHoursThisWeek}h
        studied
      </p>
      {data.whatsNextLabel && <p className="text-sm">Next up: {data.whatsNextLabel}</p>}
      {data.flaggedSections.map(({ title, attempt }) => (
        <p key={attempt.id} className="text-sm text-text-secondary">
          {title} quiz: {attempt.correctCount}/{attempt.totalQuestions}. Worth a second pass before
          moving on?
        </p>
      ))}
    </div>
  );
}
