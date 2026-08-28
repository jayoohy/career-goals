import { db } from '@/services/db';
import { todayLocalDate } from '@/utils/dateUtils';

import { createRestLog, createStudiedLog, MIN_STUDIED_MINUTES } from './dailyLogService';

beforeEach(async () => {
  await db.dailyLogs.clear();
});

describe('createStudiedLog', () => {
  it('rejects a duration below the 10-minute floor', async () => {
    await expect(
      createStudiedLog({
        date: todayLocalDate(),
        linkedItemId: 'python-prerequisites',
        linkedItemKind: 'course_section',
        durationMinutes: MIN_STUDIED_MINUTES - 1,
      }),
    ).rejects.toThrow(/10/);
    expect(await db.dailyLogs.count()).toBe(0);
  });

  it('accepts a duration at exactly the floor', async () => {
    const log = await createStudiedLog({
      date: todayLocalDate(),
      linkedItemId: 'python-prerequisites',
      linkedItemKind: 'course_section',
      durationMinutes: MIN_STUDIED_MINUTES,
    });
    expect(log.type).toBe('studied');
    expect(await db.dailyLogs.get(todayLocalDate())).toEqual(log);
  });
});

describe('createRestLog', () => {
  it('rejects a date other than today (no pre-marking)', async () => {
    await expect(createRestLog('2000-01-01')).rejects.toThrow();
    expect(await db.dailyLogs.count()).toBe(0);
  });

  it('accepts today', async () => {
    const log = await createRestLog(todayLocalDate());
    expect(log.type).toBe('rest');
    expect(await db.dailyLogs.get(todayLocalDate())).toEqual(log);
  });
});
