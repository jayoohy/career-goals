import type { CourseSection } from '@/types/models';

const STATUS_LABEL: Record<CourseSection['status'], string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
  skipped: 'Skipped',
};

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h${mins}m`;
}

interface SectionCardProps {
  section: CourseSection;
  onPress: () => void;
  /** Lessons done / total — real per-video progress, shown as a bar instead of just a status word. */
  lessonProgress: { done: number; total: number };
  /** True when the section's latest quiz attempt is flagged for review (§7.1) — informational only, never gating. */
  flagged?: boolean;
}

export function SectionCard({ section, onPress, lessonProgress, flagged }: SectionCardProps) {
  const percent =
    lessonProgress.total > 0 ? Math.round((lessonProgress.done / lessonProgress.total) * 100) : 0;

  return (
    <button
      onClick={onPress}
      className="flex w-full flex-col gap-2 rounded-2xl bg-surface p-4 text-left active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 shrink truncate font-heading font-semibold">{section.title}</span>
        {flagged && (
          <span className="shrink-0 rounded-full bg-surface-strong px-2 py-0.5 text-xs font-semibold">
            worth a revisit
          </span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-surface-strong">
        <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
      </div>
      <div className="flex items-center justify-between gap-2 text-sm text-text-secondary">
        <span>
          {lessonProgress.done}/{lessonProgress.total} videos · {formatDuration(section.durationMinutes)}
        </span>
        <span>{STATUS_LABEL[section.status]}</span>
      </div>
    </button>
  );
}
