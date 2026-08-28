'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  createRestLog,
  createStudiedLog,
  getLogForDate,
  getTotalStudiedMinutes,
  type CreateStudiedLogInput,
} from '@/services/dailyLogService';
import {
  canUseRestDay,
  getCurrentBudget,
  incrementUsedCount,
  setRestDayCap,
} from '@/services/restDayBudgetService';
import { syncDayLogged } from '@/services/logSyncService';
import { recordStudiedOrRestDay } from '@/services/streakService';
import type { DailyLog, RestDayBudget } from '@/types/models';
import { todayLocalDate } from '@/utils/dateUtils';

export function useDailyLog() {
  const [todayLog, setTodayLog] = useState<DailyLog | null>(null);
  const [restBudget, setRestBudget] = useState<RestDayBudget | null>(null);
  const [totalStudiedMinutes, setTotalStudiedMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [log, budget, totalMinutes] = await Promise.all([
        getLogForDate(todayLocalDate()),
        getCurrentBudget(),
        getTotalStudiedMinutes(),
      ]);
      setTodayLog(log);
      setRestBudget(budget);
      setTotalStudiedMinutes(totalMinutes);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const markStudied = useCallback(
    async (input: Omit<CreateStudiedLogInput, 'date'>) => {
      const log = await createStudiedLog({ ...input, date: todayLocalDate() });
      await recordStudiedOrRestDay(log.date);
      await syncDayLogged(log.date); // best-effort — see logSyncService.ts
      await refresh();
      return log;
    },
    [refresh],
  );

  const markRest = useCallback(async () => {
    const canRest = await canUseRestDay();
    if (!canRest) {
      throw new Error('No rest days left this month.');
    }
    const log = await createRestLog(todayLocalDate());
    await incrementUsedCount();
    await recordStudiedOrRestDay(log.date);
    await syncDayLogged(log.date); // best-effort — see logSyncService.ts
    await refresh();
    return log;
  }, [refresh]);

  const updateRestDayCap = useCallback(
    async (cap: number) => {
      await setRestDayCap(cap);
      await refresh();
    },
    [refresh],
  );

  return {
    todayLog,
    restBudget,
    totalStudiedMinutes,
    loading,
    refresh,
    markStudied,
    markRest,
    updateRestDayCap,
  };
}
