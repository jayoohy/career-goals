'use client';

import { useState } from 'react';

import { BookIcon, ChevronLeftIcon, CloseIcon, MoonIcon } from '@/components/icons';
import { RestDayIndicator } from '@/components/RestDayIndicator';
import { PARALLEL_ROADMAP_ITEM_IDS } from '@/constants/roadmap';
import type { CourseSection, LinkedItemKind, RestDayBudget, RoadmapItem } from '@/types/models';
import { chime, tick } from '@/utils/feedback';

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
/** A single session can't be longer than one very long study day — stops fat-finger entries like "600" meaning 6:00. */
const MAX_SESSION_MINUTES = 600;

function parseCustomMinutes(raw: string): number | null {
  const n = Math.round(Number(raw));
  if (!Number.isFinite(n) || n <= 0 || n > MAX_SESSION_MINUTES) {
    return null;
  }
  return n;
}

/**
 * Works out what you're allowed to log time against right now:
 *  - while the course is unfinished, only the current section (it's done in order — no logging
 *    section 2 while section 1 is open);
 *  - once every section is done/skipped, the current roadmap step, plus any roadmap items whose
 *    plan says they run alongside other work (see PARALLEL_ROADMAP_ITEM_IDS).
 */
function getLoggableItems(
  courseSections: CourseSection[],
  roadmapItems: RoadmapItem[],
): SelectableItem[] {
  const currentSection = courseSections.find((s) => s.status !== 'done' && s.status !== 'skipped');
  if (currentSection) {
    return [{ id: currentSection.id, kind: 'course_section', label: currentSection.title }];
  }

  const courseStarted = courseSections.length > 0;
  if (!courseStarted) return [];

  const openItems = roadmapItems.filter((r) => r.status !== 'done' && r.status !== 'deferred');
  const allowed = openItems.filter(
    (r, index) => index === 0 || PARALLEL_ROADMAP_ITEM_IDS.has(r.id),
  );
  return allowed.map((r) => ({ id: r.id, kind: 'roadmap_item', label: r.title }));
}

/**
 * A short, one-decision-per-screen flow. Sessions are additive — reopen the same day to log
 * more time; it never overwrites what's already logged.
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

  const loggableItems = getLoggableItems(courseSections, roadmapItems);
  const hasChoice = loggableItems.length > 1;
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

  function startStudy() {
    if (loggableItems.length === 0) return;
    if (loggableItems.length === 1) {
      setSelected(loggableItems[0]);
      setStep('duration');
    } else {
      setStep('pick-item');
    }
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
      chime();
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
      tick();
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
    <div className="fixed inset-0 z-100 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex max-h-[88dvh] w-full max-w-(--max-content-width) flex-col gap-4 overflow-y-auto rounded-t-3xl bg-background p-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:rounded-3xl sm:pb-6">
        <div className="flex items-center gap-3">
          {step !== 'choose' && (
            <button
              onClick={() => setStep(step === 'duration' && hasChoice ? 'pick-item' : 'choose')}
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
              onClick={startStudy}
              disabled={loggableItems.length === 0}
              className="flex items-center gap-4 rounded-2xl border-2 border-border bg-surface p-4 text-left active:scale-[0.98] disabled:opacity-50"
            >
              <BookIcon className="h-8 w-8 shrink-0 text-primary" />
              <div>
                <p className="font-heading font-semibold">I studied</p>
                <p className="text-sm text-text-secondary">
                  {loggableItems.length === 0
                    ? 'Nothing left on the plan — nice work'
                    : loggableItems.length === 1
                      ? loggableItems[0].label
                      : 'Pick what you worked on'}
                </p>
              </div>
            </button>
            {!hasSessionsToday && (
              <button
                onClick={() => setStep('rest-confirm')}
                className="flex items-center gap-4 rounded-2xl border-2 border-border bg-surface p-4 text-left active:scale-[0.98]"
              >
                <MoonIcon className="h-8 w-8 shrink-0 text-streak" />
                <div>
                  <p className="font-heading font-semibold">Rest day</p>
                  <p className="text-sm text-text-secondary">Doesn&apos;t break your streak</p>
                </div>
              </button>
            )}
          </div>
        )}

        {step === 'pick-item' && (
          <div className="flex flex-col gap-2">
            {loggableItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelected(item);
                  setStep('duration');
                }}
                className="rounded-xl bg-surface p-3 text-left text-sm"
              >
                {item.label}
              </button>
            ))}
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
                onChange={(e) =>
                  setCustomMinutes(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))
                }
                placeholder="Other (minutes)"
                inputMode="numeric"
                className="min-h-11 flex-1 rounded-xl border border-border bg-transparent px-3 text-text"
              />
              <button
                disabled={submitting || parseCustomMinutes(customMinutes) === null}
                onClick={() => {
                  const minutes = parseCustomMinutes(customMinutes);
                  if (minutes === null) {
                    setError(`Enter a number of minutes between 1 and ${MAX_SESSION_MINUTES}.`);
                    return;
                  }
                  submitDuration(minutes);
                }}
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
                restDaysRemaining <= 0
                  ? 'bg-surface text-text-secondary'
                  : 'bg-primary text-on-primary'
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
