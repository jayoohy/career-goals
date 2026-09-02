'use client';

import { useState } from 'react';

import { TrashIcon } from '@/components/icons';
import type { RoadmapItem, RoadmapItemStatus } from '@/types/models';

const STATUS_OPTIONS: { value: Exclude<RoadmapItemStatus, 'deferred'>; label: string }[] = [
  { value: 'not_started', label: 'Not started' },
  { value: 'in_progress', label: 'Doing' },
  { value: 'done', label: 'Done' },
];

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
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

/**
 * One roadmap step. Status is set with an explicit 3-way control (not a single button that
 * cycled not-started → doing → done on every tap — too easy to knock a step to "done" by
 * accident). Any step can be removed, behind an inline confirm.
 */
export function RoadmapItemCard({
  item,
  unlocked,
  isFirst,
  isLast,
  onStatusChange,
  onDefer,
  onDelete,
  onMoveUp,
  onMoveDown,
}: RoadmapItemCardProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const isDeferred = item.status === 'deferred';

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-strong px-2 py-0.5 text-xs font-semibold text-text-secondary">
          {GROUP_LABEL[item.sectionGroup]}
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
        <button
          onClick={() => setConfirmingDelete(true)}
          aria-label={`Remove ${item.title}`}
          className="ml-auto text-text-secondary"
        >
          <TrashIcon className="h-4 w-4" />
        </button>
      </div>

      <p className="font-heading font-semibold">{item.title}</p>
      <p className="text-sm text-text-secondary">About {item.estimatedHours} hours</p>
      <p className="text-sm">{item.description}</p>

      {confirmingDelete ? (
        <div className="mt-1 flex items-center gap-3 rounded-xl bg-surface-strong p-3">
          <p className="flex-1 text-sm">Remove this step from your roadmap?</p>
          <button
            onClick={() => {
              onDelete();
              setConfirmingDelete(false);
            }}
            className="rounded-full bg-destructive px-3 py-1.5 text-sm font-semibold text-white"
          >
            Remove
          </button>
          <button
            onClick={() => setConfirmingDelete(false)}
            className="text-sm text-text-secondary"
          >
            Keep
          </button>
        </div>
      ) : isDeferred ? (
        <div className="mt-1 flex items-center gap-3">
          <span className="text-sm text-text-secondary">Set aside for later</span>
          <button
            onClick={() => onStatusChange('not_started')}
            className="rounded-full bg-surface-strong px-3 py-1.5 text-sm font-semibold"
          >
            Bring back
          </button>
        </div>
      ) : (
        <>
          <div className="mt-1 flex gap-1 rounded-full bg-surface-strong p-1">
            {STATUS_OPTIONS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => onStatusChange(value)}
                className={`flex-1 rounded-full px-2 py-1.5 text-xs font-semibold ${
                  item.status === value ? 'bg-primary text-on-primary' : 'text-text-secondary'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {unlocked && (
            <div className="flex items-center gap-4">
              <button onClick={onDefer} className="text-sm text-text-secondary underline">
                Set aside
              </button>
              <div className="ml-auto flex gap-3">
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
            </div>
          )}
        </>
      )}
    </div>
  );
}
