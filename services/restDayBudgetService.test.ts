import { db } from '@/services/db';

import {
  canUseRestDay,
  getBudgetForMonth,
  incrementUsedCount,
  setRestDayCap,
} from './restDayBudgetService';

beforeEach(async () => {
  await db.restDayBudgets.clear();
});

describe('getBudgetForMonth', () => {
  it('creates a fresh budget (cap 4, used 0) for a month with no existing row', async () => {
    const budget = await getBudgetForMonth('2026-08');
    expect(budget).toEqual({ month: '2026-08', cap: 4, usedCount: 0 });
  });
});

describe('canUseRestDay / incrementUsedCount', () => {
  it('allows use while below the cap, then blocks at the cap', async () => {
    const month = '2026-09';
    for (let i = 0; i < 4; i += 1) {
      expect(await canUseRestDay(month)).toBe(true);
      await incrementUsedCount(month);
    }
    expect(await canUseRestDay(month)).toBe(false);
    await expect(incrementUsedCount(month)).rejects.toThrow(/cap/i);
  });
});

describe('monthly rollover', () => {
  it('a new month starts fresh regardless of a prior month being maxed out', async () => {
    const usedUpMonth = '2026-10';
    for (let i = 0; i < 4; i += 1) {
      await incrementUsedCount(usedUpMonth);
    }
    expect(await canUseRestDay(usedUpMonth)).toBe(false);

    const nextMonth = '2026-11';
    expect(await canUseRestDay(nextMonth)).toBe(true);
    const budget = await getBudgetForMonth(nextMonth);
    expect(budget.usedCount).toBe(0);
  });
});

describe('setRestDayCap', () => {
  it('updates the cap for a month, creating it if missing', async () => {
    const budget = await setRestDayCap(6, '2026-12');
    expect(budget.cap).toBe(6);
  });
});
