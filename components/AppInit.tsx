'use client';

import { useEffect, useState } from 'react';

import { SplashScreen } from '@/components/SplashScreen';
import { runDayCloseCheck } from '@/services/dayCloseService';
import { initDatabase } from '@/services/db';
import { initSync, localHasActivity, syncOnStart } from '@/services/syncService';
import { loadFeedbackPreference } from '@/utils/feedback';
import { requestPersistentStorage } from '@/utils/persistentStorage';

/**
 * Client-side app bootstrap: open/seed the local database, then reconcile with the server
 * backup (syncService). The sync network round-trip only *blocks* first render when there's no
 * local data to show yet (a fresh device or a wiped one) — otherwise the app renders immediately
 * with what's on-device, and sync catches up in the background (reloading once, only if it
 * turns out a newer copy existed elsewhere). This used to always block on sync, which meant a
 * slow or hung request held the launch screen up on every open.
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

        const hasLocalData = await localHasActivity();
        if (hasLocalData) {
          await runDayCloseCheck();
          setReady(true);
          void syncOnStart().then((replaced) => {
            if (replaced) window.location.reload();
          });
        } else {
          // Nothing to show locally yet — worth the wait to pull a real backup instead of
          // flashing an empty app (the fetch itself is timeout-bounded, so this can't hang).
          await syncOnStart();
          await runDayCloseCheck();
          setReady(true);
        }
      } catch (error) {
        console.error('Failed to initialize app', error);
        setReady(true);
      }
    })();
  }, []);

  if (!ready) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
