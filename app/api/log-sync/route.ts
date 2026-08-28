import { NextResponse, type NextRequest } from 'next/server';

import { isAuthorized } from '@/server/auth';
import { setDayLogFlag } from '@/server/dayLogFlag';
import type { DayLogSyncFlag } from '@/types/models';

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as DayLogSyncFlag;
  if (!body?.date || typeof body.logged !== 'boolean') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await setDayLogFlag(body);
  return NextResponse.json({ ok: true });
}
