'use client';

import { useCallback, useEffect, useState } from 'react';

import { isJobReady } from '@/services/milestoneService';

/** Drives the persistent job-ready badge (PRD §4.3) — re-derives on demand, never stored itself. */
export function useMilestone() {
  const [jobReady, setJobReady] = useState(false);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setJobReady(await isJobReady());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { jobReady, loading, refresh };
}
