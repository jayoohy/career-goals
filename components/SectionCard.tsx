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
  /** True when the section's latest quiz attempt is flagged for review (§7.1) — informational only, never gating. */
  flagged?: boolean;
}

export function SectionCard({ section, onPress, flagged }: SectionCardProps) {
  return (
    <button
      onClick={onPress}
      className="flex w-full flex-col gap-1 rounded-2xl bg-background-element p-4 text-left hover:opacity-90"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 shrink truncate text-sm font-bold">{section.title}</span>
        {section.skimFlag && <span className="text-sm text-text-secondary">skim</span>}
        {flagged && (
          <span className="rounded-full bg-background-selected px-2 py-0.5 text-sm">
            worth a revisit
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-text-secondary">
          {section.videoCount} videos · {formatDuration(section.durationMinutes)}
        </span>
        <span className="text-sm text-text-secondary">{STATUS_LABEL[section.status]}</span>
      </div>
    </button>
  );
}
