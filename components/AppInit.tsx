'use client';

import { useEffect, useState } from 'react';

import { SplashScreen } from '@/components/SplashScreen';
import { runDayCloseCheck } from '@/services/dayCloseService';
import { initDatabase } from '@/services/db';
import { loadFeedbackPreference } from '@/utils/feedback';

/**
 * Client-side app bootstrap — web equivalent of the Expo app's RootLayout effect: open/seed the
 * database, then approximate day-close (§9's local-only approximation) before any screen reads
 * streak state. Push-subscription setup (replacing `ensureNotificationSetup`) is wired in task 5.
 */
export function AppInit({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadFeedbackPreference();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch((error: unknown) => {
        console.error('Service worker registration failed', error);
      });
    }

    initDatabase()
      .then(() => runDayCloseCheck())
      .catch((error: unknown) => {
        console.error('Failed to initialize app', error);
      })
      .finally(() => setReady(true));
  }, []);

  if (!ready) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
