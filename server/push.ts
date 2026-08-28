import webpush from 'web-push';

import { redis } from '@/server/redis';
import type { PushSubscriptionRecord } from '@/types/models';

const SUBSCRIPTION_KEY = 'push:subscription';

function ensureVapidConfigured(): void {
  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!subject || !publicKey || !privateKey) {
    throw new Error('VAPID_SUBJECT / NEXT_PUBLIC_VAPID_PUBLIC_KEY / VAPID_PRIVATE_KEY must be set.');
  }
  webpush.setVapidDetails(subject, publicKey, privateKey);
}

export async function getStoredSubscription(): Promise<PushSubscriptionRecord | null> {
  return redis.get<PushSubscriptionRecord>(SUBSCRIPTION_KEY);
}

export async function saveSubscription(subscription: PushSubscriptionRecord): Promise<void> {
  await redis.set(SUBSCRIPTION_KEY, subscription);
}

export async function clearSubscription(): Promise<void> {
  await redis.del(SUBSCRIPTION_KEY);
}

export interface PushPayload {
  title: string;
  body: string;
  url?: string;
}

/**
 * Sends a push to Joy's stored subscription. Clears the subscription on a 410 (expired)
 * response (PRD requirement 31) rather than retrying — the client re-subscribes on next open.
 * Returns false (not an error) when there's no stored subscription yet, since that's the normal
 * state before Joy has ever enabled notifications.
 */
export async function sendPush(payload: PushPayload): Promise<boolean> {
  const subscription = await getStoredSubscription();
  if (!subscription) {
    return false;
  }

  ensureVapidConfigured();

  try {
    await webpush.sendNotification(
      subscription as unknown as webpush.PushSubscription,
      JSON.stringify(payload),
    );
    return true;
  } catch (error) {
    const statusCode = (error as { statusCode?: number } | undefined)?.statusCode;
    if (statusCode === 410) {
      await clearSubscription();
      return false;
    }
    throw error;
  }
}
