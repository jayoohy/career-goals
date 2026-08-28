'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  addStudySession,
  createRestLog,
  getLogForDate,
  getTotalStudiedMinutes,
  meetsStudiedFloor,
  type AddStudySessionInput,
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

  /** Adds a study session to today (there can be more than one — see dailyLogService). Only records the streak/day-status once today's total crosses the 10-minute floor. */
  const addSession = useCallback(
    async (input: Omit<AddStudySessionInput, 'date'>) => {
      const log = await addStudySession({ ...input, date: todayLocalDate() });
      if (meetsStudiedFloor(log)) {
        await recordStudiedOrRestDay(log.date);
        await syncDayLogged(log.date); // best-effort — see logSyncService.ts
      }
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
    addSession,
    markRest,
    updateRestDayCap,
  };
}
