'use client';

import { useCallback, useEffect, useState } from 'react';

import { getLastSyncedAt, subscribeSyncStatus, syncNow } from '@/services/syncService';

/** Backs the Settings "Backup" card — when the local data last reached the server, and a manual trigger. */
export function useSync() {
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setLastSyncedAt(getLastSyncedAt());
    return subscribeSyncStatus(() => setLastSyncedAt(getLastSyncedAt()));
  }, []);

  const run = useCallback(async () => {
    setSyncing(true);
    try {
      await syncNow();
    } finally {
      setSyncing(false);
      setLastSyncedAt(getLastSyncedAt());
    }
  }, []);

  return { lastSyncedAt, syncing, syncNow: run };
}
