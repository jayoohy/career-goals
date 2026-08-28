'use client';

import { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { CheckIcon } from '@/components/icons';
import { useCourseLessons } from '@/hooks/useCourseLessons';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useFlaggedSections } from '@/hooks/useFlaggedSections';
import { getAttemptsForSection } from '@/services/quizService';
import { getTotalMinutesForItem } from '@/services/dailyLogService';
import type { QuizAttempt } from '@/types/models';

export default function SectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { sections, skip } = useCourseSections();
  const section = sections.find((s) => s.id === id);
  const { lessons, toggle, bulkMarkDone } = useCourseLessons(id);
  const { flaggedSectionIds } = useFlaggedSections();
  const [knownUpTo, setKnownUpTo] = useState('');
  const [minutesLogged, setMinutesLogged] = useState(0);
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    getTotalMinutesForItem(id).then(setMinutesLogged);
    getAttemptsForSection(id).then((attempts) => setLastAttempt(attempts[0] ?? null));
  }, [id, lessons]);

  if (!section) {
    return (
      <main className="mx-auto max-w-(--max-content-width) px-6 pb-10">
        <p className="text-sm">Section not found.</p>
      </main>
    );
  }

  const doneCount = lessons.filter((l) => l.done).length;
  const percent = lessons.length > 0 ? Math.round((doneCount / lessons.length) * 100) : 0;
  const canShowSkim = section.skimFlag && section.status !== 'done' && section.status !== 'skipped';
  const timeCoveredButNotDone = section.status !== 'done' && minutesLogged >= section.durationMinutes;
  const readyForQuiz = section.status === 'done' || timeCoveredButNotDone;

  async function handleMarkKnown() {
    const n = parseInt(knownUpTo, 10);
    if (Number.isNaN(n) || n <= 0) return;
    const ids = lessons.slice(0, n).map((l) => l.id);
    await bulkMarkDone(ids);
    setKnownUpTo('');
  }

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <h1 className="font-heading text-3xl font-bold">{section.title}</h1>
      <p className="text-sm text-text-secondary">{section.videoCount} videos</p>
      {section.notes && <p className="text-sm">{section.notes}</p>}

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">
            {doneCount}/{lessons.length} watched
          </span>
          <span className="text-text-secondary">{percent}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-surface-strong">
          <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${percent}%` }} />
        </div>
      </div>

      {canShowSkim && (
        <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
          <p className="font-heading font-semibold">Already know some of this?</p>
          <p className="text-sm text-text-secondary">
            Mark the videos you already know as done in one tap, instead of checking each one.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm">I know videos 1 through</span>
            <input
              value={knownUpTo}
              onChange={(e) => setKnownUpTo(e.target.value)}
              inputMode="numeric"
              placeholder="e.g. 15"
              className="min-h-11 w-20 rounded-xl border border-border bg-transparent px-2 text-center text-text"
            />
          </div>
          <button
            disabled={!knownUpTo}
            onClick={handleMarkKnown}
            className="rounded-2xl bg-primary p-3 text-center font-heading font-semibold text-on-primary disabled:opacity-50"
          >
            Mark as known
          </button>
        </div>
      )}

      {readyForQuiz && (
        <div className="flex flex-col gap-2 rounded-2xl bg-surface-strong p-4">
          <p className="font-heading font-semibold">
            {section.status === 'done' ? 'Section complete — ready for a quick check?' : "You've logged enough time for this section"}
          </p>
          {lastAttempt && (
            <p className="text-sm text-text-secondary">
              Last attempt: {lastAttempt.correctCount}/{lastAttempt.totalQuestions}
              {flaggedSectionIds.has(id) ? ' — worth a second pass.' : '.'}
            </p>
          )}
          <button
            onClick={() => router.push(`/course/${id}/quiz`)}
            className="self-start rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
          >
            Take the quiz
          </button>
        </div>
      )}

      <div className="flex flex-col gap-1">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            onClick={() => toggle(lesson.id, !lesson.done)}
            className="flex items-center gap-3 rounded-xl p-2 text-left active:bg-surface"
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                lesson.done ? 'border-primary bg-primary' : 'border-border'
              }`}
            >
              {lesson.done && <CheckIcon className="h-4 w-4 text-on-primary" />}
            </span>
            <span className={`text-sm ${lesson.done ? 'text-text-secondary line-through' : 'text-text'}`}>
              {lesson.title}
            </span>
          </button>
        ))}
      </div>

      {section.status !== 'skipped' && section.status !== 'done' && (
        <button onClick={() => skip(id)} className="self-start text-sm text-text-secondary underline">
          Skip this section
        </button>
      )}
    </main>
  );
}
