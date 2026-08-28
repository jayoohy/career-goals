import type { NextRequest } from 'next/server';

/** Shared-secret gate for /api/subscribe and /api/log-sync (PRD requirement 32) — not full auth, proportionate for a single-user app with no accounts. */
export function isAuthorized(request: NextRequest): boolean {
  const expected = process.env.PUSH_SHARED_SECRET;
  if (!expected) {
    return false;
  }
  const header = request.headers.get('authorization');
  return header === `Bearer ${expected}`;
}

/** Vercel sends `Authorization: Bearer ${CRON_SECRET}` automatically on Cron Job requests when CRON_SECRET is set — the documented way to verify a request actually came from Vercel Cron. */
export function isAuthorizedCron(request: NextRequest): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    return false;
  }
  const header = request.headers.get('authorization');
  return header === `Bearer ${expected}`;
}
