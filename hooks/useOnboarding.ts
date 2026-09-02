'use client';

import { useCallback, useEffect, useState } from 'react';

const ONBOARDING_STORAGE_KEY = 'career-goals:onboarded';

type OnboardingStatus = 'loading' | 'needed' | 'done';

/**
 * Tracks whether the one-time intro flow has been seen. Stored in localStorage (not the Dexie
 * DB) — it's a per-device UI preference, not app data, and needs to be readable synchronously
 * on first render.
 */
export function useOnboarding() {
  const [status, setStatus] = useState<OnboardingStatus>('loading');

  useEffect(() => {
    let seen = false;
    try {
      seen = localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
    } catch {
      // localStorage unavailable — treat as seen so a broken storage never traps the user
      // on the intro screen forever.
      seen = true;
    }
    setStatus(seen ? 'done' : 'needed');
  }, []);

  const complete = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {
      // Non-fatal — worst case the intro shows again next launch.
    }
    setStatus('done');
  }, []);

  return { status, complete };
}
