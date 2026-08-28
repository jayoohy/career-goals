'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  getNotificationConfig,
  updateNotificationConfig,
} from '@/services/notificationConfigService';
import type { NotificationConfig } from '@/types/models';

export function useNotificationConfig() {
  const [config, setConfig] = useState<NotificationConfig | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setConfig(await getNotificationConfig());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const update = useCallback(async (patch: Partial<NotificationConfig>) => {
    const next = await updateNotificationConfig(patch);
    setConfig(next);
    return next;
  }, []);

  return { config, loading, refresh, update };
}
