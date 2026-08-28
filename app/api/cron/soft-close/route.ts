import { NextResponse, type NextRequest } from 'next/server';

import { isAuthorizedCron } from '@/server/auth';
import { sendDailyTierIfUnlogged } from '@/server/dailyNotify';

/** 20:00 Lagos — window soft-close, non-punitive nudge (PRD §5). */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await sendDailyTierIfUnlogged('softClose');
  return NextResponse.json(result);
}
