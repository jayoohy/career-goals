'use client';

import { useState } from 'react';

import { RestDayIndicator } from '@/components/RestDayIndicator';
import { MIN_STUDIED_MINUTES } from '@/services/dailyLogService';
import type { CourseSection, LinkedItemKind, RestDayBudget, RoadmapItem } from '@/types/models';

interface SelectableItem {
  id: string;
  kind: LinkedItemKind;
  label: string;
}

interface DailyLogModalProps {
  open: boolean;
  onClose: () => void;
  courseSections: CourseSection[];
  roadmapItems: RoadmapItem[];
  restBudget: RestDayBudget | null;
  onMarkStudied: (input: {
    linkedItemId: string;
    linkedItemKind: LinkedItemKind;
    durationMinutes: number;
  }) => Promise<unknown>;
  onMarkRest: () => Promise<unknown>;
}

/** Logging UI for today (studied/rest). Enforces the 10-min floor and the rest-day cap at the UI layer, on top of the service-layer validation. */
export function DailyLogModal({
  open,
  onClose,
  courseSections,
  roadmapItems,
  restBudget,
  onMarkStudied,
  onMarkRest,
}: DailyLogModalProps) {
  const [mode, setMode] = useState<'studied' | 'rest'>('studied');
  const [selected, setSelected] = useState<SelectableItem | null>(null);
  const [durationText, setDurationText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) {
    return null;
  }

  const selectableItems: SelectableItem[] = [
    ...courseSections
      .filter((s) => s.status !== 'done' && s.status !== 'skipped')
      .map((s) => ({ id: s.id, kind: 'course_section' as const, label: s.title })),
    ...roadmapItems
      .filter((r) => r.status !== 'done' && r.status !== 'deferred')
      .map((r) => ({ id: r.id, kind: 'roadmap_item' as const, label: r.title })),
  ];

  const restDaysRemaining = restBudget ? restBudget.cap - restBudget.usedCount : 0;

  function reset() {
    setSelected(null);
    setDurationText('');
    setError(null);
    setMode('studied');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmitStudied() {
    const duration = parseInt(durationText, 10);
    if (!selected) {
      setError('Pick what you worked on.');
      return;
    }
    if (Number.isNaN(duration) || duration < MIN_STUDIED_MINUTES) {
      setError(`Needs at least ${MIN_STUDIED_MINUTES} minutes.`);
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onMarkStudied({
        linkedItemId: selected.id,
        linkedItemKind: selected.kind,
        durationMinutes: duration,
      });
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not log today.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitRest() {
    setSubmitting(true);
    setError(null);
    try {
      await onMarkRest();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not mark rest day.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="flex max-h-[85%] w-full max-w-(--max-content-width) flex-col gap-4 overflow-y-auto rounded-t-3xl bg-background p-6 sm:rounded-3xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Log today</h2>
          <button onClick={handleClose} className="text-sm text-text-secondary">
            Close
          </button>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setMode('studied')}
            className={`rounded-full px-4 py-2 text-sm font-bold ${mode === 'studied' ? 'bg-background-selected' : 'bg-background-element'}`}
          >
            Studied
          </button>
          <button
            onClick={() => setMode('rest')}
            className={`rounded-full px-4 py-2 text-sm font-bold ${mode === 'rest' ? 'bg-background-selected' : 'bg-background-element'}`}
          >
            Rest
          </button>
        </div>

        {mode === 'studied' ? (
          <>
            <div className="max-h-60 overflow-y-auto">
              {selectableItems.map((item) => (
                <button
                  key={`${item.kind}-${item.id}`}
                  onClick={() => setSelected(item)}
                  className={`mb-1 w-full rounded-lg p-2 text-left text-sm ${selected?.id === item.id && selected?.kind === item.kind ? 'bg-background-selected' : 'bg-background-element'}`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <input
              value={durationText}
              onChange={(e) => setDurationText(e.target.value)}
              placeholder="Minutes (min 10)"
              inputMode="numeric"
              className="rounded-lg border border-background-selected bg-transparent p-2 text-text"
            />
            {error && <p className="text-sm text-text-secondary">{error}</p>}
            <button
              disabled={submitting}
              onClick={handleSubmitStudied}
              className="rounded-2xl bg-background-selected p-4 text-center text-sm font-bold disabled:opacity-50"
            >
              Log studied day
            </button>
          </>
        ) : (
          <>
            <RestDayIndicator budget={restBudget} />
            {error && <p className="text-sm text-text-secondary">{error}</p>}
            <button
              disabled={submitting || restDaysRemaining <= 0}
              onClick={handleSubmitRest}
              className={`rounded-2xl p-4 text-center text-sm font-bold disabled:opacity-50 ${restDaysRemaining <= 0 ? 'bg-background-element' : 'bg-background-selected'}`}
            >
              {restDaysRemaining <= 0 ? 'No rest days left' : 'Mark today as rest'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
