import { db } from '@/services/db';
import type { StreakState } from '@/types/models';
import { applyDayLogged, applyMissedDay } from '@/utils/streakLogic';

export async function getStreakState(): Promise<StreakState> {
  const row = await db.streakState.get(1);
  if (!row) {
    throw new Error('streak_state row missing — initDatabase() must run before any streak read.');
  }
  return row;
}

async function persist(next: StreakState): Promise<StreakState> {
  await db.streakState.update(1, next);
  return next;
}

/** Call when a day is logged studied or rest — both count toward the streak (PRD §5/§6). */
export async function recordStudiedOrRestDay(date: string): Promise<StreakState> {
  const current = await getStreakState();
  const result = applyDayLogged(current, date);
  return persist({
    currentStreak: result.currentStreak,
    longestStreak: result.longestStreak,
    lastLoggedDate: result.lastLoggedDate,
    streakBrokenPendingAck: current.streakBrokenPendingAck,
  });
}

/** Call at day-close when a day ends unlogged and unmarked — full reset, no soft decay (PRD §5). */
export async function recordMissedDay(): Promise<StreakState> {
  const current = await getStreakState();
  const result = applyMissedDay(current);
  return persist({
    currentStreak: result.currentStreak,
    longestStreak: current.longestStreak,
    lastLoggedDate: current.lastLoggedDate,
    streakBrokenPendingAck: result.streakBrokenPendingAck,
  });
}

/** Clears the pending flag once the one-line streak-break message (§6.1) has been shown. */
export async function acknowledgeStreakBreak(): Promise<StreakState> {
  const current = await getStreakState();
  return persist({ ...current, streakBrokenPendingAck: false });
}
