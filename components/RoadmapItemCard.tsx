'use client';

import { ROADMAP_GROUP_LABEL } from '@/constants/roadmap';
import type { RoadmapItem, RoadmapItemStatus } from '@/types/models';

const STATUS_LABEL: Record<RoadmapItemStatus, string> = {
  not_started: 'Not started',
  in_progress: 'In progress',
  done: 'Done',
  deferred: 'Set aside',
};

interface RoadmapItemCardProps {
  item: RoadmapItem;
  /** done / total sub-steps — shown as a bar, same as a course section's video progress. */
  progress: { done: number; total: number };
  /** The first step that isn't done or set aside — gets a "Next up" badge and a highlight ring. */
  isNext?: boolean;
  unlocked: boolean;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

/**
 * A roadmap step in the list — tappable, opening its detail page (checklist), exactly like a
 * course section card opens its video list. No inline status control anymore: status is derived
 * from the item's checklist, set on the detail page. Reorder arrows show only once the course is
 * done (PRD §4.2) and don't trigger the card's navigation.
 */
export function RoadmapItemCard({
  item,
  progress,
  isNext = false,
  unlocked,
  isFirst,
  isLast,
  onPress,
  onMoveUp,
  onMoveDown,
}: RoadmapItemCardProps) {
  const percent = progress.total > 0 ? Math.round((progress.done / progress.total) * 100) : 0;

  return (
    <div
      className={`flex flex-col gap-2 rounded-2xl bg-surface p-4 ${
        isNext ? 'ring-2 ring-primary' : ''
      } ${item.status === 'done' ? 'opacity-60' : ''}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        {isNext && (
          <span className="rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-on-primary">
            Next up
          </span>
        )}
        <span className="rounded-full bg-surface-strong px-2 py-0.5 text-xs font-semibold text-text-secondary">
          {ROADMAP_GROUP_LABEL[item.sectionGroup]}
        </span>
        {item.jobReadyThreshold && (
          <span className="rounded-full bg-streak px-2 py-0.5 text-xs font-semibold text-on-streak">
            Needed to apply
          </span>
        )}
        {item.isOngoing && (
          <span className="rounded-full bg-surface-strong px-2 py-0.5 text-xs font-semibold text-text-secondary">
            Ongoing
          </span>
        )}
      </div>

      <button onClick={onPress} className="flex flex-col gap-2 text-left active:scale-[0.99]">
        <span className="font-heading font-semibold">{item.title}</span>

        {progress.total > 0 && (
          <span className="h-2 overflow-hidden rounded-full bg-surface-strong">
            <span
              className="block h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </span>
        )}

        <span className="flex items-center justify-between gap-2 text-sm text-text-secondary">
          <span>
            {progress.total > 0
              ? `${progress.done}/${progress.total} steps · about ${item.estimatedHours}h`
              : `About ${item.estimatedHours} hours`}
          </span>
          <span>{STATUS_LABEL[item.status]}</span>
        </span>
      </button>

      {unlocked && (
        <div className="flex justify-end gap-3">
          <button
            disabled={isFirst}
            onClick={onMoveUp}
            aria-label="Move up"
            className={`text-lg ${isFirst ? 'text-text-secondary opacity-40' : 'text-text'}`}
          >
            ↑
          </button>
          <button
            disabled={isLast}
            onClick={onMoveDown}
            aria-label="Move down"
            className={`text-lg ${isLast ? 'text-text-secondary opacity-40' : 'text-text'}`}
          >
            ↓
          </button>
        </div>
      )}
    </div>
  );
}
