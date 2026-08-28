'use client';

import { useState } from 'react';

import { BookIcon, ChevronLeftIcon, CloseIcon, MoonIcon } from '@/components/icons';
import { RestDayIndicator } from '@/components/RestDayIndicator';
import type { CourseSection, LinkedItemKind, RestDayBudget, RoadmapItem } from '@/types/models';

interface SelectableItem {
  id: string;
  kind: LinkedItemKind;
  label: string;
}

interface DailyLogModalProps {
  open: boolean;
  onClose: () => void;
  hasSessionsToday: boolean;
  courseSections: CourseSection[];
  roadmapItems: RoadmapItem[];
  restBudget: RestDayBudget | null;
  onAddSession: (input: {
    linkedItemId: string;
    linkedItemKind: LinkedItemKind;
    durationMinutes: number;
  }) => Promise<unknown>;
  onMarkRest: () => Promise<unknown>;
}

type Step = 'choose' | 'pick-item' | 'duration' | 'rest-confirm';

const DURATION_CHOICES = [10, 20, 30, 45, 60];

/**
 * A short, one-decision-per-screen flow instead of one crowded form (the earlier version showed
 * every option and a bare number field at once). Sessions are additive — this can be opened
 * again the same day to log more time; it never overwrites what's already logged.
 */
export function DailyLogModal({
  open,
  onClose,
  hasSessionsToday,
  courseSections,
  roadmapItems,
  restBudget,
  onAddSession,
  onMarkRest,
}: DailyLogModalProps) {
  const [step, setStep] = useState<Step>('choose');
  const [selected, setSelected] = useState<SelectableItem | null>(null);
  const [customMinutes, setCustomMinutes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const activeSections = courseSections.filter((s) => s.status !== 'done' && s.status !== 'skipped');
  const activeRoadmapItems = roadmapItems.filter((r) => r.status !== 'done' && r.status !== 'deferred');
  const restDaysRemaining = restBudget ? restBudget.cap - restBudget.usedCount : 0;

  function reset() {
    setStep('choose');
    setSelected(null);
    setCustomMinutes('');
    setError(null);
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function submitDuration(minutes: number) {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      await onAddSession({
        linkedItemId: selected.id,
        linkedItemKind: selected.kind,
        durationMinutes: minutes,
      });
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not log that session.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleConfirmRest() {
    setSubmitting(true);
    setError(null);
    try {
      await onMarkRest();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not mark today as rest.');
    } finally {
      setSubmitting(false);
    }
  }

  const title =
    step === 'choose'
      ? hasSessionsToday
        ? 'Log more time'
        : "What's today?"
      : step === 'pick-item'
        ? 'What did you work on?'
        : step === 'duration'
          ? 'How long?'
          : 'Rest day';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex max-h-[85%] w-full max-w-(--max-content-width) flex-col gap-4 overflow-y-auto rounded-t-3xl bg-background p-6 sm:rounded-3xl">
        <div className="flex items-center gap-3">
          {step !== 'choose' && (
            <button
              onClick={() => setStep(step === 'duration' ? 'pick-item' : 'choose')}
              aria-label="Back"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface"
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
          )}
          <h2 className="flex-1 font-heading text-xl font-semibold">{title}</h2>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {step === 'choose' && (
          <div className="flex flex-col gap-3">
            <button
              onClick={() => setStep('pick-item')}
              className="flex items-center gap-4 rounded-2xl border-2 border-border bg-surface p-4 text-left active:scale-[0.98]"
            >
              <BookIcon className="h-8 w-8 text-primary" />
              <div>
                <p className="font-heading font-semibold">I studied</p>
                <p className="text-sm text-text-secondary">Log time against a section or item</p>
              </div>
            </button>
            {!hasSessionsToday && (
              <button
                onClick={() => setStep('rest-confirm')}
                className="flex items-center gap-4 rounded-2xl border-2 border-border bg-surface p-4 text-left active:scale-[0.98]"
              >
                <MoonIcon className="h-8 w-8 text-streak" />
                <div>
                  <p className="font-heading font-semibold">Rest day</p>
                  <p className="text-sm text-text-secondary">Doesn&apos;t break your streak</p>
                </div>
              </button>
            )}
          </div>
        )}

        {step === 'pick-item' && (
          <div className="flex flex-col gap-4 overflow-y-auto">
            {activeSections.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Course
                </p>
                <div className="flex flex-col gap-2">
                  {activeSections.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setSelected({ id: s.id, kind: 'course_section', label: s.title });
                        setStep('duration');
                      }}
                      className="rounded-xl bg-surface p-3 text-left text-sm"
                    >
                      {s.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {activeRoadmapItems.length > 0 && (
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-text-secondary">
                  Roadmap
                </p>
                <div className="flex flex-col gap-2">
                  {activeRoadmapItems.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setSelected({ id: r.id, kind: 'roadmap_item', label: r.title });
                        setStep('duration');
                      }}
                      className="rounded-xl bg-surface p-3 text-left text-sm"
                    >
                      {r.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'duration' && selected && (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-text-secondary">{selected.label}</p>
            <div className="flex flex-wrap gap-2">
              {DURATION_CHOICES.map((minutes) => (
                <button
                  key={minutes}
                  disabled={submitting}
                  onClick={() => submitDuration(minutes)}
                  className="rounded-full bg-primary px-5 py-3 font-heading font-semibold text-on-primary disabled:opacity-50"
                >
                  {minutes} min
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Custom minutes"
                inputMode="numeric"
                className="min-h-11 flex-1 rounded-xl border border-border bg-transparent px-3 text-text"
              />
              <button
                disabled={submitting || !customMinutes}
                onClick={() => submitDuration(parseInt(customMinutes, 10))}
                className="min-h-11 rounded-xl bg-surface-strong px-4 text-sm font-semibold disabled:opacity-50"
              >
                Log it
              </button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        {step === 'rest-confirm' && (
          <div className="flex flex-col gap-4">
            <RestDayIndicator budget={restBudget} />
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              disabled={submitting || restDaysRemaining <= 0}
              onClick={handleConfirmRest}
              className={`min-h-11 rounded-2xl p-4 text-center font-heading font-semibold disabled:opacity-50 ${
                restDaysRemaining <= 0 ? 'bg-surface text-text-secondary' : 'bg-primary text-on-primary'
              }`}
            >
              {restDaysRemaining <= 0 ? 'No rest days left this month' : 'Confirm rest day'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
