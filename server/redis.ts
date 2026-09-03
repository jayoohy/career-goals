import { Redis } from '@upstash/redis';

/**
 * The entire server-side footprint of this app: one Redis instance holding a handful of keys —
 * the push subscription (server/push.ts), today's log-status flag (server/dayLogFlag.ts), and
 * the whole-database backup snapshot (server/stateStore.ts). Still single-user, no accounts.
 */
export const redis = Redis.fromEnv();
