'use client';

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
        className="flex flex-col gap-0.5 rounded-2xl bg-background-element px-4 py-2 text-left"
      >
        <span className="text-sm font-bold">{streakBreakLine(streak.longestStreak)}</span>
        <span className="text-sm text-text-secondary">Tap to dismiss</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 rounded-2xl bg-background-element px-4 py-2">
      <span className="text-sm font-bold">
        {streak.currentStreak} day{streak.currentStreak === 1 ? '' : 's'} current
      </span>
      <span className="text-sm text-text-secondary">Longest: {streak.longestStreak}</span>
    </div>
  );
}
