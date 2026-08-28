import { NextResponse, type NextRequest } from 'next/server';

import { isAuthorizedCron } from '@/server/auth';
import { sendWeeklyReviewPush } from '@/server/dailyNotify';

/** Sunday evening — weekly review push (PRD §7, requirement 30). Always sends; not gated on log status. */
export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const result = await sendWeeklyReviewPush();
  return NextResponse.json(result);
}
