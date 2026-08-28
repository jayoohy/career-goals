import { NextResponse, type NextRequest } from 'next/server';

import { isAuthorizedCron } from '@/server/auth';
import { sendDailyTierIfUnlogged } from '@/server/dailyNotify';

/** 19:45 Lagos — lighter nudge if still unopened (PRD §5). */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await sendDailyTierIfUnlogged('nudge');
  return NextResponse.json(result);
}
