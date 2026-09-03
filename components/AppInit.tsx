'use client';

import { useEffect, useState } from 'react';

import { SplashScreen } from '@/components/SplashScreen';
import { runDayCloseCheck } from '@/services/dayCloseService';
import { initDatabase } from '@/services/db';
import { initSync, syncOnStart } from '@/services/syncService';
import { loadFeedbackPreference } from '@/utils/feedback';
import { requestPersistentStorage } from '@/utils/persistentStorage';

/**
 * Client-side app bootstrap: open/seed the local database, reconcile it with the server backup
 * (syncService), then run the local day-close approximation before any screen reads streak
 * state. Order matters — sync must land the real data before day-close judges the streak.
 */
export function AppInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadFeedbackPreference();
    void requestPersistentStorage();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
        console.error('Service worker registration failed', error);
      });
    }

    (async () => {
      try {
        await initDatabase();
        initSync();
        await syncOnStart();
        await runDayCloseCheck();
      } catch (error) {
        console.error('Failed to initialize app', error);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
