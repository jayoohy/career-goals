'use client';

import { useState } from 'react';

import { BellIcon } from '@/components/icons';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useNotificationConfig } from '@/hooks/useNotificationConfig';
import { usePushSubscription } from '@/hooks/usePushSubscription';

function TimeField({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div>
        <p className="text-sm">{label}</p>
        <p className="text-xs text-text-secondary">{helper}</p>
      </div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="HH:MM"
        className="min-h-11 w-20 rounded-lg border border-border bg-transparent px-2 text-right text-text"
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
      <h1 className="-mb-2 font-heading text-3xl font-bold">Settings</h1>

      <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
        <div className="flex items-center gap-2">
          <BellIcon className="h-5 w-5 text-primary" />
          <p className="font-heading font-semibold">Reminders</p>
        </div>
        {!push.installed ? (
          <p className="text-sm text-text-secondary">
            Add this app to your home screen first (Share → Add to Home Screen) — reminders only
            work once it&apos;s installed that way.
          </p>
        ) : push.subscribed ? (
          <p className="text-sm text-text-secondary">Reminders are on for this device.</p>
        ) : (
          <>
            <p className="text-sm text-text-secondary">
              Get a nudge if a day goes unlogged, and a weekly recap — even when the app is closed.
            </p>
            <button
              onClick={push.enable}
              className="self-start rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
            >
              Turn on reminders
            </button>
          </>
        )}
        {push.error && <p className="text-sm text-destructive">{push.error}</p>}
      </div>

      {config && (
        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4">
          <p className="font-heading font-semibold">Reminder schedule</p>

          <label className="flex items-center justify-between gap-2">
            <span className="text-sm">Daily reminders</span>
            <input
              type="checkbox"
              checked={config.remindersEnabled}
              onChange={(e) => void update({ remindersEnabled: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between gap-2">
            <span className="text-sm">Weekly recap</span>
            <input
              type="checkbox"
              checked={config.weeklyReviewEnabled}
              onChange={(e) => void update({ weeklyReviewEnabled: e.target.checked })}
            />
          </label>

          <TimeField
            label="First reminder"
            helper="When your study window opens"
            value={config.windowStart}
            onChange={(v) => update({ windowStart: v })}
          />
          <TimeField
            label="Gentle check-in"
            helper="If nothing's logged yet"
            value={config.windowEnd}
            onChange={(v) => update({ windowEnd: v })}
          />
          <TimeField
            label="Last call"
            helper="Final nudge before the day ends"
            value={config.hardDeadline}
            onChange={(v) => update({ hardDeadline: v })}
          />
        </div>
      )}

      <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
        <p className="font-heading font-semibold">Rest days</p>
        <p className="text-sm text-text-secondary">
          {restBudget ? restBudget.cap - restBudget.usedCount : 4} left this month (out of{' '}
          {restBudget?.cap ?? 4}).
        </p>
        <div className="flex items-center gap-2">
          <input
            value={capText}
            onChange={(e) => setCapText(e.target.value)}
            placeholder="New monthly limit"
            inputMode="numeric"
            className="min-h-11 w-32 rounded-lg border border-border bg-transparent px-2 text-text"
          />
          <button
            onClick={handleSaveCap}
            className="min-h-11 rounded-lg bg-surface-strong px-4 text-sm font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </main>
  );
}
