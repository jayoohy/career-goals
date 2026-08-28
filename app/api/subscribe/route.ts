import { NextResponse, type NextRequest } from 'next/server';

import { isAuthorized } from '@/server/auth';
import { saveSubscription } from '@/server/push';
import type { PushSubscriptionRecord } from '@/types/models';

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as PushSubscriptionRecord;
  if (!body?.endpoint || !body.keys?.p256dh || !body.keys?.auth) {
    return NextResponse.json({ error: 'Invalid subscription payload' }, { status: 400 });
  }

  await saveSubscription(body);
  return NextResponse.json({ ok: true });
}
