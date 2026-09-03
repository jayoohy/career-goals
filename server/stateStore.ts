import { redis } from '@/server/redis';
import type { StateSnapshot } from '@/types/models';

/**
 * Whole-app-state backup (Option A). One Redis key holds a JSON snapshot of the client's entire
 * Dexie database, so a phone that gets its local storage evicted (iOS does this) — or a second
 * device — can pull the data back. Single user, so a single key; last write wins by `updatedAt`.
 */
const STATE_KEY = 'state:snapshot';

export type { StateSnapshot };

export async function getStateSnapshot(): Promise<StateSnapshot | null> {
  return redis.get<StateSnapshot>(STATE_KEY);
}

export async function setStateSnapshot(snapshot: StateSnapshot): Promise<void> {
  await redis.set(STATE_KEY, snapshot);
}
