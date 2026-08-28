'use client';

import { useState } from 'react';

import { useDailyLog } from '@/hooks/useDailyLog';
import { useNotificationConfig } from '@/hooks/useNotificationConfig';
import { usePushSubscription } from '@/hooks/usePushSubscription';

function TimeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="HH:MM"
        className="w-20 rounded-lg border border-background-selected bg-transparent px-2 py-1 text-right text-text"
      />
    </div>
  );
}

export default function SettingsPage() {
  const { config, update } = useNotificationConfig();
  const { restBudget, updateRestDayCap } = useDailyLog();
  const push = usePushSubscription();
  const [capText, setCapText] = useState('');

  async function handleSaveCap() {
    const cap = parseInt(capText, 10);
    if (Number.isNaN(cap) || cap < 0) return;
    await updateRestDayCap(cap);
    setCapText('');
  }

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <h1 className="-mb-2 text-4xl font-semibold">Settings</h1>

      <div className="flex flex-col gap-2 rounded-2xl bg-background-element p-4">
        <p className="text-sm font-bold">Push notifications</p>
        {!push.installed ? (
          <p className="text-sm text-text-secondary">
            Add this app to your home screen first — iOS only allows notifications for installed
            PWAs, not a regular browser tab.
          </p>
        ) : push.subscribed ? (
          <p className="text-sm text-text-secondary">Enabled on this device.</p>
        ) : (
          <>
            <p className="text-sm text-text-secondary">
              Turn on daily reminders and the weekly review, sent even when the app is closed.
            </p>
            <button
              onClick={push.enable}
              className="self-start rounded-full bg-background-selected px-4 py-1 text-sm"
            >
              Enable notifications
            </button>
          </>
        )}
        {push.error && <p className="text-sm text-text-secondary">{push.error}</p>}
      </div>

      {config && (
        <div className="flex flex-col gap-2 rounded-2xl bg-background-element p-4">
          <p className="text-sm font-bold">Notifications</p>

          <label className="flex items-center justify-between gap-2">
            <span className="text-sm">Daily reminders</span>
            <input
              type="checkbox"
              checked={config.remindersEnabled}
              onChange={(e) => void update({ remindersEnabled: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span className="text-sm">Weekly review</span>
            <input
              type="checkbox"
              checked={config.weeklyReviewEnabled}
              onChange={(e) => void update({ weeklyReviewEnabled: e.target.checked })}
            />
          </label>

          <TimeField
            label="Window start"
            value={config.windowStart}
            onChange={(v) => update({ windowStart: v })}
          />
          <TimeField
            label="Window end"
            value={config.windowEnd}
            onChange={(v) => update({ windowEnd: v })}
          />
          <TimeField
            label="Hard deadline"
            value={config.hardDeadline}
            onChange={(v) => update({ hardDeadline: v })}
          />
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-2xl bg-background-element p-4">
        <p className="text-sm font-bold">Rest days</p>
        <p className="text-sm text-text-secondary">
          Currently {restBudget?.cap ?? 4} per month ({restBudget?.usedCount ?? 0} used this
          month).
        </p>
        <div className="flex items-center gap-2">
          <input
            value={capText}
            onChange={(e) => setCapText(e.target.value)}
            placeholder="New cap"
            inputMode="numeric"
            className="w-20 rounded-lg border border-background-selected bg-transparent px-2 py-1 text-text"
          />
          <button onClick={handleSaveCap} className="rounded-lg bg-background-selected px-4 py-1 text-sm">
            Save
          </button>
        </div>
      </div>
    </main>
  );
}
