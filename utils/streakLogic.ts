import type { StreakState } from '@/types/models';

import { addDaysToDateString } from './dateUtils';

export interface StreakTransitionResult {
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string;
}

/**
 * Pure function: given prior streak state and a new day logged as studied/rest, compute the
 * next streak state. Consecutive-day logging increments; a gap (or first-ever log) restarts
 * at 1; logging the same day twice is a no-op. See PRD §6.
 */
export function applyDayLogged(state: StreakState, date: string): StreakTransitionResult {
  if (state.lastLoggedDate === date) {
    return {
      currentStreak: state.currentStreak,
      longestStreak: state.longestStreak,
      lastLoggedDate: state.lastLoggedDate,
    };
  }

  const isConsecutive =
    state.lastLoggedDate !== null && addDaysToDateString(state.lastLoggedDate, 1) === date;
  const nextStreak = isConsecutive ? state.currentStreak + 1 : 1;

  return {
    currentStreak: nextStreak,
    longestStreak: Math.max(state.longestStreak, nextStreak),
    lastLoggedDate: date,
  };
}

export interface MissedDayResult {
  currentStreak: number;
  streakBrokenPendingAck: boolean;
}

/** Pure function: full reset to 0 on a missed day — no soft decay (PRD §5). */
export function applyMissedDay(state: StreakState): MissedDayResult {
  return {
    currentStreak: 0,
    streakBrokenPendingAck: state.currentStreak > 0,
  };
}
