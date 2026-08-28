import { DAILY_COPY, WEEKLY_REVIEW_COPY } from '@/constants/copy';
import { isLoggedToday } from '@/server/dayLogFlag';
import { todayInLagos } from '@/server/lagosDate';
import { sendPush } from '@/server/push';

/** Sends one of the four daily escalation tiers (PRD §5), but only if today is still unlogged — checked at send time, not pre-decided at schedule time (PRD requirement 34). */
export async function sendDailyTierIfUnlogged(
  tier: keyof typeof DAILY_COPY,
): Promise<{ sent: boolean; reason?: 'already-logged' | 'no-subscription' }> {
  const logged = await isLoggedToday(todayInLagos());
  if (logged) {
    return { sent: false, reason: 'already-logged' };
  }

  const copy = DAILY_COPY[tier];
  const sent = await sendPush({ title: copy.title, body: copy.body, url: '/' });
  return sent ? { sent: true } : { sent: false, reason: 'no-subscription' };
}

/** Weekly review push (PRD requirement 30) — always sent, not gated on log status. */
export async function sendWeeklyReviewPush(): Promise<{ sent: boolean }> {
  const sent = await sendPush({
    title: WEEKLY_REVIEW_COPY.title,
    body: WEEKLY_REVIEW_COPY.body,
    url: '/progress',
  });
  return { sent };
}
