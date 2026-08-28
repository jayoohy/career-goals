'use client';

import { useCallback, useEffect, useState } from 'react';

import { acknowledgeStreakBreak, getStreakState } from '@/services/streakService';
import type { StreakState } from '@/types/models';

export function useStreak() {
  const [streak, setStreak] = useState<StreakState | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setStreak(await getStreakState());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  /** Call once the one-line streak-break message (§6.1) has been shown to the user. */
  const acknowledgeBreak = useCallback(async () => {
    await acknowledgeStreakBreak();
    await refresh();
  }, [refresh]);

  return { streak, loading, refresh, acknowledgeBreak };
}
