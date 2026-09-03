import { NextResponse, type NextRequest } from 'next/server';

import { isAuthorized } from '@/server/auth';
import { getStateSnapshot, setStateSnapshot } from '@/server/stateStore';
import type { StateSnapshot } from '@/types/models';

/** GET — the current backup, or null if nothing's been synced yet. */
export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({ snapshot: await getStateSnapshot() });
}

/** PUT — store a newer snapshot. A stale push (older `updatedAt` than what's stored) is rejected
 * with 409 and the current snapshot, so the caller can pull instead of clobbering fresher data. */
export async function PUT(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = (await request.json()) as Partial<StateSnapshot>;
  if (
    typeof body?.updatedAt !== 'number' ||
    typeof body?.deviceId !== 'string' ||
    typeof body?.tables !== 'object' ||
    body.tables === null
  ) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const existing = await getStateSnapshot();
  if (existing && existing.updatedAt > body.updatedAt && existing.deviceId !== body.deviceId) {
    return NextResponse.json({ error: 'Stale', snapshot: existing }, { status: 409 });
  }

  const snapshot: StateSnapshot = {
    updatedAt: body.updatedAt,
    deviceId: body.deviceId,
    tables: body.tables as Record<string, unknown[]>,
  };
  await setStateSnapshot(snapshot);
  return NextResponse.json({ ok: true });
}
