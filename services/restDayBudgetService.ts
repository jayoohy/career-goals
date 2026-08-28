import { db } from '@/services/db';
import type { RestDayBudget } from '@/types/models';
import { currentMonthKey, todayLocalDate } from '@/utils/dateUtils';

const DEFAULT_CAP = 4;

/** Returns the budget row for `month`, creating it (cap 4, used 0) if this is its first read — handles the month-rollover on the 1st implicitly. */
export async function getBudgetForMonth(month: string): Promise<RestDayBudget> {
  const existing = await db.restDayBudgets.get(month);
  if (existing) {
    return existing;
  }

  const fresh: RestDayBudget = { month, cap: DEFAULT_CAP, usedCount: 0 };
  await db.restDayBudgets.add(fresh);
  return fresh;
}

export async function getCurrentBudget(): Promise<RestDayBudget> {
  return getBudgetForMonth(currentMonthKey(todayLocalDate()));
}

export async function canUseRestDay(
  month: string = currentMonthKey(todayLocalDate()),
): Promise<boolean> {
  const budget = await getBudgetForMonth(month);
  return budget.usedCount < budget.cap;
}

/** Increments used_count for `month`. Callers must check `canUseRestDay()` first — this does not silently clamp. */
export async function incrementUsedCount(
  month: string = currentMonthKey(todayLocalDate()),
): Promise<RestDayBudget> {
  const budget = await getBudgetForMonth(month);
  if (budget.usedCount >= budget.cap) {
    throw new Error(
      `Rest-day cap already reached for ${month} (${budget.usedCount}/${budget.cap}).`,
    );
  }

  const usedCount = budget.usedCount + 1;
  await db.restDayBudgets.update(month, { usedCount });
  return { ...budget, usedCount };
}

export async function setRestDayCap(
  cap: number,
  month: string = currentMonthKey(todayLocalDate()),
): Promise<RestDayBudget> {
  await getBudgetForMonth(month); // ensure row exists
  await db.restDayBudgets.update(month, { cap });
  return getBudgetForMonth(month);
}
