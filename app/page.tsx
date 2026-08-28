'use client';

import { useState } from 'react';

import { DailyLogModal } from '@/components/DailyLogModal';
import { RestDayIndicator } from '@/components/RestDayIndicator';
import { StreakBadge } from '@/components/StreakBadge';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useDailyLog } from '@/hooks/useDailyLog';
import { useRoadmap } from '@/hooks/useRoadmap';
import { useStreak } from '@/hooks/useStreak';
import type { CreateStudiedLogInput } from '@/services/dailyLogService';
import type { DailyLog } from '@/types/models';
import { formatFriendlyDate, todayLocalDate } from '@/utils/dateUtils';

function statusLine(todayLog: DailyLog | null): string {
  if (!todayLog) return "Today's empty.";
  if (todayLog.type === 'studied') return `Logged: studied ${todayLog.durationMinutes} min`;
  if (todayLog.type === 'rest') return 'Logged: rest day';
  return "Today's empty.";
}

export default function TodayPage() {
  const { todayLog, restBudget, markStudied, markRest } = useDailyLog();
  const { streak, acknowledgeBreak } = useStreak();
  const { sections } = useCourseSections();
  const { items } = useRoadmap();
  const [modalOpen, setModalOpen] = useState(false);

  async function handleMarkStudied(input: Omit<CreateStudiedLogInput, 'date'>) {
    return markStudied(input);
  }

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <h1 className="-mb-2 text-4xl font-semibold">Today</h1>
      <p className="text-sm text-text-secondary">{formatFriendlyDate(todayLocalDate())}</p>

      <StreakBadge streak={streak} onAcknowledgeBreak={acknowledgeBreak} />

      <div className="flex flex-col gap-2 rounded-2xl bg-background-element p-4">
        <p className="text-sm font-bold">{statusLine(todayLog)}</p>
        <RestDayIndicator budget={restBudget} />
      </div>

      {!todayLog && (
        <>
          {/* Fallback "supervisor" nudge (req. 24) for when push permission is denied or a
              subscription has lapsed — push itself is wired in task 5. */}
          <p className="text-sm text-text-secondary">
            Today&apos;s empty. Still time before the streak notices.
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="rounded-2xl bg-background-selected p-4 text-center text-sm font-bold"
          >
            Log today
          </button>
        </>
      )}

      <DailyLogModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        courseSections={sections}
        roadmapItems={items}
        restBudget={restBudget}
        onMarkStudied={handleMarkStudied}
        onMarkRest={markRest}
      />
    </main>
  );
}
