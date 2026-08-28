import { Redis } from '@upstash/redis';

/**
 * The entire server-side footprint of this app (PRD "Push notifications" §7): one Redis
 * instance holding exactly two keys (the push subscription, and today's log-status flag). Not
 * a general database — see server/push.ts and server/dayLogFlag.ts for the two things it stores.
 */
export const redis = Redis.fromEnv();
