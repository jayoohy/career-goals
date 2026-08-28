import { db } from '@/services/db';
import type { NotificationConfig } from '@/types/models';

export async function getNotificationConfig(): Promise<NotificationConfig> {
  const row = await db.notificationConfig.get(1);
  if (!row) {
    throw new Error('notification_config row missing — initDatabase() must run first.');
  }
  return row;
}

export async function updateNotificationConfig(
  patch: Partial<NotificationConfig>,
): Promise<NotificationConfig> {
  const current = await getNotificationConfig();
  const next = { ...current, ...patch };
  await db.notificationConfig.update(1, patch);
  return next;
}
