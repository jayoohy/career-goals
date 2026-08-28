'use client';

import { FlameIcon } from '@/components/icons';
import { streakBreakLine } from '@/constants/copy';
import type { StreakState } from '@/types/models';

interface StreakBadgeProps {
  streak: StreakState | null;
  onAcknowledgeBreak: () => void;
}

/** Current/longest streak display. Renders the one-line streak-break message (§6.1) instead of the normal counters when a break is pending acknowledgement. */
export function StreakBadge({ streak, onAcknowledgeBreak }: StreakBadgeProps) {
  if (!streak) {
    return null;
  }

  if (streak.streakBrokenPendingAck) {
    return (
      <button
        onClick={onAcknowledgeBreak}
        className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 text-left"
      >
        <FlameIcon className="h-7 w-7 text-text-secondary" />
        <div>
          <p className="font-heading font-semibold">{streakBreakLine(streak.longestStreak)}</p>
          <p className="text-sm text-text-secondary">Tap to dismiss</p>
        </div>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-surface px-4 py-3">
      <FlameIcon className="h-7 w-7 text-streak" />
      <div>
        <p className="font-heading font-semibold">
          {streak.currentStreak} day{streak.currentStreak === 1 ? '' : 's'} streak
        </p>
        <p className="text-sm text-text-secondary">Longest: {streak.longestStreak}</p>
      </div>
    </div>
  );
}
