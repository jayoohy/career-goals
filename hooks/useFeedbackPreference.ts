'use client';

import { useCallback, useEffect, useState } from 'react';

import { loadFeedbackPreference, setFeedbackEnabled } from '@/utils/feedback';

/** Reactive wrapper over the sound/haptic preference in utils/feedback (module-level otherwise). */
export function useFeedbackPreference() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(loadFeedbackPreference());
  }, []);

  const toggle = useCallback((next: boolean) => {
    setFeedbackEnabled(next);
    setEnabled(next);
  }, []);

  return { enabled, toggle };
}
