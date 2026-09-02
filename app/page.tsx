'use client';

import { useState } from 'react';

import { BookIcon, MoonIcon } from '@/components/icons';
import { DailyLogModal } from '@/components/DailyLogModal';
import { RestDayIndicator } from '@/components/RestDayIndicator';
import { StreakBadge } from '@/components/StreakBadge';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useRoadmap } from '@/hooks/useRoadmap';
import { useStreak } from '@/hooks/useStreak';
import { formatFriendlyDate, todayLocalDate } from '@/utils/dateUtils';

export default function TodayPage() {
  const { todayLog, restBudget, addSession, markRest } = useDailyLog();
  const { streak, acknowledgeBreak } = useStreak();
  const { sections } = useCourseSections();
  const { items } = useRoadmap();
  const [modalOpen, setModalOpen] = useState(false);

  const sessions = todayLog?.type === 'studied' ? (todayLog.sessions ?? []) : [];
  const isRestDay = todayLog?.type === 'rest';
  const hasSessionsToday = sessions.length > 0;

  function labelFor(id: string, kind: 'course_section' | 'roadmap_item'): string {
    if (kind === 'course_section') return sections.find((s) => s.id === id)?.title ?? 'Section';
    return items.find((r) => r.id === id)?.title ?? 'Roadmap item';
  }

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <h1 className="-mb-2 font-heading text-3xl font-bold">Today</h1>
      <p className="text-sm text-text-secondary">{formatFriendlyDate(todayLocalDate())}</p>

      <StreakBadge streak={streak} onAcknowledgeBreak={acknowledgeBreak} />

      {isRestDay ? (
        <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
          <MoonIcon className="h-7 w-7 shrink-0 text-streak" />
          <div>
            <p className="font-heading font-semibold">Today&apos;s a rest day</p>
            <p className="text-sm text-text-secondary">
              Doesn&apos;t break your streak. See you tomorrow.
            </p>
          </div>
        </div>
      ) : hasSessionsToday ? (
        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-4">
          <p className="font-heading font-semibold">Today&apos;s sessions</p>
          <div className="flex flex-col gap-2">
            {sessions.map((session, i) => (
              <div key={i} className="flex items-center gap-3">
                <BookIcon className="h-5 w-5 shrink-0 text-primary" />
                <p className="text-sm">
                  {labelFor(session.linkedItemId, session.linkedItemKind)} —{' '}
                  {session.durationMinutes} min
                </p>
              </div>
            ))}
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-1 self-start rounded-full bg-surface-strong px-4 py-2 text-sm font-semibold"
          >
            + Log more time
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl bg-surface p-6 text-center">
          <p className="font-heading text-lg font-semibold">Nothing logged yet</p>
          <p className="text-sm text-text-secondary">
            Still time before the streak notices. Even 10 minutes counts.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-2 rounded-2xl bg-primary p-4 text-center font-heading font-semibold text-on-primary active:scale-[0.98]"
          >
            Log today
          </button>
        </div>
      )}

      <RestDayIndicator budget={restBudget} />

      <DailyLogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        hasSessionsToday={hasSessionsToday}
        courseSections={sections}
        roadmapItems={items}
        restBudget={restBudget}
        onAddSession={addSession}
        onMarkRest={markRest}
      />
    </main>
  );
}
