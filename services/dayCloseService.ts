import { createMissedLog, getLogForDate } from '@/services/dailyLogService';
import { getStreakState, recordMissedDay } from '@/services/streakService';
import { addDaysToDateString, daysBetween, todayLocalDate } from '@/utils/dateUtils';

export interface DayCloseResult {
  daysMissed: number;
}

/**
 * Local push can't run background logic reliably (PRD §9), so day-close is approximated on
 * next app open: any calendar day strictly between the last logged day and today that has no
 * `DailyLog` is missed. Today itself is never marked missed here — its window is still open
 * until the real 11:59 PM deadline (§5), which this local-only approximation can't observe
 * directly. Call once per app launch, before screens read streak state.
 */
export async function runDayCloseCheck(): Promise<DayCloseResult> {
  const streak = await getStreakState();
  const today = todayLocalDate();

  if (!streak.lastLoggedDate || streak.lastLoggedDate === today) {
    return { daysMissed: 0 };
  }

  const gapDays = daysBetween(streak.lastLoggedDate, today) - 1;
  if (gapDays <= 0) {
    return { daysMissed: 0 };
  }

  let cursor = addDaysToDateString(streak.lastLoggedDate, 1);
  for (let i = 0; i < gapDays; i += 1) {
    const existing = await getLogForDate(cursor);
    if (!existing) {
      await createMissedLog(cursor);
    }
    cursor = addDaysToDateString(cursor, 1);
  }

  await recordMissedDay();
  return { daysMissed: gapDays };
}
