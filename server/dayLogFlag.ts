import { redis } from '@/server/redis';
import type { DayLogSyncFlag } from '@/types/models';

const DAY_LOG_KEY = 'push:dayLog';

export async function getDayLogFlag(): Promise<DayLogSyncFlag | null> {
  return redis.get<DayLogSyncFlag>(DAY_LOG_KEY);
}

export async function setDayLogFlag(flag: DayLogSyncFlag): Promise<void> {
  await redis.set(DAY_LOG_KEY, flag);
}

/** True only if today's flag is both present and logged — a stale flag from a prior day must never suppress today's notifications. */
export async function isLoggedToday(today: string): Promise<boolean> {
  const flag = await getDayLogFlag();
  return flag?.date === today && flag.logged === true;
}
