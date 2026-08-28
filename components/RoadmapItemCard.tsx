import type { RoadmapItem, RoadmapItemStatus } from '@/types/models';

const STATUS_LABEL: Record<RoadmapItemStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
  deferred: 'Deferred',
};

const NEXT_STATUS: Record<RoadmapItemStatus, RoadmapItemStatus> = {
  not_started: 'in_progress',
  in_progress: 'done',
  done: 'not_started',
  deferred: 'not_started',
};

const GROUP_LABEL: Record<RoadmapItem['sectionGroup'], string> = {
  course: 'Course',
  core_skills: 'Core skills',
  robotics_track: 'Robotics track',
  portfolio: 'Portfolio',
  deployment: 'Deployment',
  career: 'Career',
};

interface RoadmapItemCardProps {
  item: RoadmapItem;
  unlocked: boolean;
  isFirst: boolean;
  isLast: boolean;
  onStatusChange: (next: RoadmapItemStatus) => void;
  onDefer: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function RoadmapItemCard({
  item,
  unlocked,
  isFirst,
  isLast,
  onStatusChange,
  onDefer,
  onMoveUp,
  onMoveDown,
}: RoadmapItemCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-strong px-2 py-0.5 text-xs font-semibold text-text-secondary">
          {GROUP_LABEL[item.sectionGroup]}
        </span>
        {item.jobReadyThreshold && (
          <span className="rounded-full bg-streak px-2 py-0.5 text-xs font-semibold text-on-streak">floor</span>
        )}
        {item.isOngoing && (
          <span className="rounded-full bg-surface-strong px-2 py-0.5 text-xs font-semibold text-text-secondary">
            ongoing
          </span>
        )}
      </div>

      <p className="font-heading font-semibold">{item.title}</p>
      <p className="text-sm text-text-secondary">~{item.estimatedHours}h</p>
      <p className="text-sm">{item.description}</p>

      <div className="mt-1 flex items-center gap-4">
        <button
          onClick={() => onStatusChange(NEXT_STATUS[item.status])}
          className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
            item.status === 'done' ? 'bg-surface-strong' : 'bg-primary text-on-primary'
          }`}
        >
          {STATUS_LABEL[item.status]}
        </button>

        {unlocked && item.status !== 'deferred' && (
          <button onClick={onDefer} className="text-sm text-text-secondary underline">
            Defer
          </button>
        )}

        {unlocked && (
          <div className="ml-auto flex gap-3">
            <button
              disabled={isFirst}
              onClick={onMoveUp}
              aria-label="Move up"
              className={`text-lg ${isFirst ? 'text-text-secondary' : 'text-text'}`}
            >
              ↑
            </button>
            <button
              disabled={isLast}
              onClick={onMoveDown}
              aria-label="Move down"
              className={`text-lg ${isLast ? 'text-text-secondary' : 'text-text'}`}
            >
              ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
