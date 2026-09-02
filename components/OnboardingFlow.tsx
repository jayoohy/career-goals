'use client';

import { useState } from 'react';

import { BellIcon, BookIcon, FlameIcon, RoadmapIcon } from '@/components/icons';
import { usePushSubscription } from '@/hooks/usePushSubscription';

interface OnboardingFlowProps {
  onDone: () => void;
}

const INTRO_POINTS = [
  {
    Icon: BookIcon,
    title: 'Log your study time',
    body: 'A minute or an hour — check in each day so it adds up.',
  },
  {
    Icon: FlameIcon,
    title: 'Keep your streak',
    body: 'Log something every day. Rest days are fine and don’t break it.',
  },
  {
    Icon: RoadmapIcon,
    title: 'Follow the roadmap',
    body: 'Finish the course, then work the steps toward CV / robotics engineer.',
  },
];

/**
 * One-time intro, shown before the app opens to Today (so a first-time user lands somewhere
 * that explains what this is, instead of straight into a logging screen). Three short steps:
 * welcome → what it does → turn on reminders.
 */
export function OnboardingFlow({ onDone }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const push = usePushSubscription();

  const isLast = step === 2;

  async function handleEnableReminders() {
    await push.enable();
    onDone();
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-(--max-content-width) flex-col px-6 py-10">
      <div className="flex flex-1 flex-col justify-center gap-6">
        {step === 0 && (
          <div className="flex flex-col items-center gap-4 text-center animate-pop-in">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-3xl font-bold text-on-primary font-heading">
              CG
            </div>
            <h1 className="font-heading text-3xl font-bold">Career Goals</h1>
            <p className="text-text-secondary">
              Your daily check-in on the road from frontend developer to computer-vision engineer.
            </p>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-4 animate-rise-fade">
            <h1 className="font-heading text-2xl font-bold">How it works</h1>
            {INTRO_POINTS.map(({ Icon, title, body }) => (
              <div key={title} className="flex items-start gap-4 rounded-2xl bg-surface p-4">
                <Icon className="mt-0.5 h-7 w-7 shrink-0 text-primary" />
                <div>
                  <p className="font-heading font-semibold">{title}</p>
                  <p className="text-sm text-text-secondary">{body}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col items-center gap-4 text-center animate-rise-fade">
            <BellIcon className="h-12 w-12 text-primary" />
            <h1 className="font-heading text-2xl font-bold">Get a nudge if a day slips</h1>
            <p className="text-text-secondary">
              A reminder in the evening if nothing’s logged yet, plus a weekly recap. You can change
              this any time in Settings.
            </p>
            {!push.installed && (
              <p className="text-sm text-text-secondary">
                Reminders start working once you add the app to your home screen (Share → Add to
                Home Screen).
              </p>
            )}
            {push.error && <p className="text-sm text-destructive">{push.error}</p>}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex justify-center gap-2" aria-hidden>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-2 w-2 rounded-full ${i === step ? 'bg-primary' : 'bg-surface-strong'}`}
            />
          ))}
        </div>

        {!isLast ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="rounded-2xl bg-primary p-4 text-center font-heading font-semibold text-on-primary active:scale-[0.98]"
          >
            Continue
          </button>
        ) : (
          <>
            <button
              onClick={handleEnableReminders}
              disabled={!push.installed}
              className="rounded-2xl bg-primary p-4 text-center font-heading font-semibold text-on-primary active:scale-[0.98] disabled:opacity-50"
            >
              Turn on reminders
            </button>
            <button onClick={onDone} className="p-2 text-center text-sm text-text-secondary">
              {push.installed ? 'Not now' : 'Skip for now'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
