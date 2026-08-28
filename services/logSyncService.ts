import type { DayLogSyncFlag } from '@/types/models';

/**
 * Client-side sync of the minimal daily-log status to the server (PRD requirement 28) — called
 * whenever a day is logged as Studied or Rest, so the cron routes know whether to notify
 * without needing the full local dataset. Best-effort: a failed sync just means tonight's
 * server-side check won't see today as logged, which only affects whether a push is sent — the
 * local data (the actual log) is unaffected either way.
 */
export async function syncDayLogged(date: string): Promise<void> {
  const secret = process.env.NEXT_PUBLIC_PUSH_SHARED_SECRET;
  if (!secret) {
    return;
  }

  const flag: DayLogSyncFlag = { date, logged: true };
  try {
    await fetch('/api/log-sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
      body: JSON.stringify(flag),
    });
  } catch (error) {
    console.error('Failed to sync day-log status', error);
  }
}
