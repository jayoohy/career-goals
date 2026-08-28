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
    <div className="flex flex-col gap-2 rounded-2xl bg-background-element p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="min-w-0 shrink text-sm font-bold">{item.title}</span>
        {item.jobReadyThreshold && (
          <span className="rounded-full bg-background-selected px-2 py-0.5 text-sm">floor</span>
        )}
        {item.isOngoing && (
          <span className="rounded-full bg-background-selected px-2 py-0.5 text-sm">ongoing</span>
        )}
      </div>

      <p className="text-sm text-text-secondary">
        {GROUP_LABEL[item.sectionGroup]} · ~{item.estimatedHours}h
      </p>

      <p className="text-sm">{item.description}</p>

      <div className="flex items-center gap-4">
        <button
          onClick={() => onStatusChange(NEXT_STATUS[item.status])}
          className="rounded-full bg-background-selected px-4 py-1 text-sm"
        >
          {STATUS_LABEL[item.status]}
        </button>

        {unlocked && item.status !== 'deferred' && (
          <button onClick={onDefer} className="text-sm text-text-secondary">
            Defer
          </button>
        )}

        {unlocked && (
          <div className="ml-auto flex gap-2">
            <button
              disabled={isFirst}
              onClick={onMoveUp}
              className={`text-sm ${isFirst ? 'text-text-secondary' : 'text-text'}`}
            >
              ↑
            </button>
            <button
              disabled={isLast}
              onClick={onMoveDown}
              className={`text-sm ${isLast ? 'text-text-secondary' : 'text-text'}`}
            >
              ↓
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
