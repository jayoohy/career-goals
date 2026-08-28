'use client';

import { useEffect } from 'react';

import { JOB_READY_COPY } from '@/constants/copy';
import { useDailyLog } from '@/hooks/useDailyLog';
import { hasJobReadyBeenNotified, isJobReady, markJobReadyNotified } from '@/services/milestoneService';

/**
 * One-time job-ready milestone notification (PRD §4.3, requirement 8) — ported from the
 * original app's `useNotificationScheduler`. `isJobReady` depends on roadmap-item completion,
 * which only lives in the client's IndexedDB, so this has to be detected client-side (unlike
 * the daily/weekly pushes, which the server can check via the synced log flag). The persistent
 * `JobReadyBadge` on the Progress page is the durable guarantee Joy will see this regardless of
 * notification permission — this is the bonus immediate nudge on top of that, shown as a local
 * notification (not a server push) via the same service worker.
 */
export function JobReadyNotifier() {
  const { todayLog } = useDailyLog();

  useEffect(() => {
    async function check() {
      if (!(await isJobReady())) return;
      if (await hasJobReadyBeenNotified()) return;

      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(JOB_READY_COPY.title, { body: JOB_READY_COPY.body });
      }
      await markJobReadyNotified();
    }

    check().catch((error: unknown) => {
      console.error('Failed to check job-ready milestone', error);
    });
  }, [todayLog]);

  return null;
}
