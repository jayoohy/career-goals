import { db } from '@/services/db';
import { todayLocalDate } from '@/utils/dateUtils';

import {
  addStudySession,
  createRestLog,
  meetsStudiedFloor,
  totalMinutesForLog,
} from './dailyLogService';

beforeEach(async () => {
  await db.dailyLogs.clear();
  await db.courseSections.clear();
});

describe('addStudySession', () => {
  it('rejects a duration of 0 or less', async () => {
    await expect(
      addStudySession({
        date: todayLocalDate(),
        linkedItemId: 'python-prerequisites',
        linkedItemKind: 'course_section',
        durationMinutes: 0,
      }),
    ).rejects.toThrow();
    expect(await db.dailyLogs.count()).toBe(0);
  });

  it('creates a studied log on the first session', async () => {
    const log = await addStudySession({
      date: todayLocalDate(),
      linkedItemId: 'python-prerequisites',
      linkedItemKind: 'course_section',
      durationMinutes: 5,
    });
    expect(log.type).toBe('studied');
    expect(log.sessions).toHaveLength(1);
    expect(meetsStudiedFloor(log)).toBe(false); // below the 10-minute floor
  });

  it('adds a second session the same day instead of overwriting the first', async () => {
    const date = todayLocalDate();
    await addStudySession({
      date,
      linkedItemId: 'a',
      linkedItemKind: 'course_section',
      durationMinutes: 5,
    });
    const log = await addStudySession({
      date,
      linkedItemId: 'b',
      linkedItemKind: 'course_section',
      durationMinutes: 8,
    });
    expect(log.sessions).toHaveLength(2);
    expect(totalMinutesForLog(log)).toBe(13);
    expect(meetsStudiedFloor(log)).toBe(true); // total now crosses the floor
  });

  it('rejects adding a study session to a day already marked rest', async () => {
    const date = todayLocalDate();
    await createRestLog(date);
    await expect(
      addStudySession({
        date,
        linkedItemId: 'a',
        linkedItemKind: 'course_section',
        durationMinutes: 20,
      }),
    ).rejects.toThrow(/rest/i);
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
