'use client';

import { useCallback, useEffect, useState } from 'react';

import { getLatestFlaggedAttempts } from '@/services/quizService';

/** Section ids whose latest quiz attempt is flagged for review (§7.1) — for badges on `SectionCard`/section detail. */
export function useFlaggedSections() {
  const [flaggedSectionIds, setFlaggedSectionIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const attempts = await getLatestFlaggedAttempts();
      setFlaggedSectionIds(new Set(attempts.map((attempt) => attempt.sectionId)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { flaggedSectionIds, loading, refresh };
}
