'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getExistingSubscription,
  isPushSupported,
  isRunningAsInstalledApp,
  subscribeToPush,
} from '@/services/pushSubscriptionService';

/** Drives the "enable notifications" control (Settings page) — only meaningful once the PWA is installed to the home screen (PRD requirement 25). */
export function usePushSubscription() {
  const [installed, setInstalled] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setInstalled(isRunningAsInstalledApp());
      const existing = await getExistingSubscription();
      setSubscribed(existing !== null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const enable = useCallback(async () => {
    setError(null);
    try {
      await subscribeToPush();
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not enable notifications.');
    }
  }, [refresh]);

  return { installed, subscribed, supported: isPushSupported(), loading, error, enable };
}
