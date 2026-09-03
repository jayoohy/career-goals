'use client';

import { useSync } from '@/hooks/useSync';
import { formatRelativeTime } from '@/utils/dateUtils';

/** Settings card: shows when the local data last reached the server backup, with a manual trigger. */
export function BackupCard() {
  const { lastSyncedAt, syncing, syncNow } = useSync();

  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
      <p className="font-heading font-semibold">Backup</p>
      <p className="text-sm text-text-secondary">
        Your progress is saved on this device and backed up to the cloud, so it survives a phone
        wipe and follows you to another device.
      </p>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm text-text-secondary">
          {syncing
            ? 'Backing up…'
            : lastSyncedAt
              ? `Last backed up ${formatRelativeTime(lastSyncedAt)}`
              : 'Not backed up yet'}
        </span>
        <button
          onClick={() => void syncNow()}
          disabled={syncing}
          className="shrink-0 rounded-full bg-surface-strong px-4 py-2 text-sm font-semibold disabled:opacity-50"
        >
          Back up now
        </button>
      </div>
    </div>
  );
}
