'use client';

import { BackupCard } from '@/components/BackupCard';
import { BellIcon } from '@/components/icons';
import { StepperField } from '@/components/StepperField';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useFeedbackPreference } from '@/hooks/useFeedbackPreference';
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
    <label className="flex items-center justify-between gap-2">
      <span>
        <span className="block text-sm">{label}</span>
        <span className="block text-xs text-text-secondary">{helper}</span>
      </span>
      <input
        type="time"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-11 rounded-lg border border-border bg-transparent px-2 text-text"
      />
    </label>
  );
}

export default function SettingsPage() {
  const { config, update } = useNotificationConfig();
  const { restBudget, updateRestDayCap } = useDailyLog();
  const push = usePushSubscription();
  const feedback = useFeedbackPreference();

  const restCap = restBudget?.cap ?? 4;

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <h1 className="-mb-2 font-heading text-3xl font-bold">Settings</h1>

      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4">
        <p className="font-heading font-semibold">Appearance</p>
        <ThemeToggle />
        <label className="flex items-center justify-between gap-2">
          <span className="text-sm">Sounds &amp; haptics</span>
          <input
            type="checkbox"
            checked={feedback.enabled}
            onChange={(e) => feedback.toggle(e.target.checked)}
          />
        </label>
      </div>

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
          <p className="font-heading font-semibold">When to remind me</p>

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
            label="Evening reminder"
            helper="A first nudge to sit down and study"
            value={config.windowStart}
            onChange={(v) => update({ windowStart: v })}
          />
          <TimeField
            label="Check-in"
            helper="A follow-up if nothing's logged yet"
            value={config.windowEnd}
            onChange={(v) => update({ windowEnd: v })}
          />
          <TimeField
            label="Last call"
            helper="Final reminder before the day ends"
            value={config.hardDeadline}
            onChange={(v) => update({ hardDeadline: v })}
          />
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4">
        <div>
          <p className="font-heading font-semibold">Rest days</p>
          <p className="text-sm text-text-secondary">
            {Math.max(restCap - (restBudget?.usedCount ?? 0), 0)} of {restCap} left this month. A
            rest day keeps your streak without studying.
          </p>
        </div>
        <StepperField
          label="Rest days per month"
          value={restCap}
          min={0}
          max={10}
          onChange={(next) => void updateRestDayCap(next)}
        />
      </div>

      <BackupCard />
    </main>
  );
}
