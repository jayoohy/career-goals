'use client';

import { use, useState } from 'react';

import { QuizPlayer } from '@/components/QuizPlayer';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useFlaggedSections } from '@/hooks/useFlaggedSections';
import { useQuiz } from '@/hooks/useQuiz';
import type { CourseSectionStatus, QuizAttempt } from '@/types/models';

const STATUS_CYCLE: CourseSectionStatus[] = ['not_started', 'in_progress', 'done', 'skipped'];

/** UI-only grouping for the §4.1 skim bulk-mark flow — no per-sub-group persistence, see courseSectionService.ts. */
const SKIM_SUBGROUPS = [
  'Basic syntax',
  'Loops & control flow',
  'Functions',
  'NumPy / Pandas basics',
];

export default function SectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { sections, setStatus } = useCourseSections();
  const section = sections.find((s) => s.id === id);
  const { questions, submit } = useQuiz(id);
  const { flaggedSectionIds, refresh: refreshFlags } = useFlaggedSections();
  const [checkedGroups, setCheckedGroups] = useState<Set<string>>(new Set());

  async function handleSubmitQuiz(answers: number[]): Promise<QuizAttempt> {
    const attempt = await submit(answers);
    await refreshFlags();
    return attempt;
  }

  if (!section) {
    return (
      <main className="mx-auto max-w-(--max-content-width) px-6 pb-10">
        <p className="text-sm">Section not found.</p>
      </main>
    );
  }

  function cycleStatus() {
    const currentIndex = STATUS_CYCLE.indexOf(section!.status);
    const next = STATUS_CYCLE[(currentIndex + 1) % STATUS_CYCLE.length];
    setStatus(section!.id, next);
  }

  function toggleGroup(group: string) {
    setCheckedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }

  const canShowSkim = section.skimFlag && section.status !== 'done' && section.status !== 'skipped';

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <h1 className="text-4xl font-semibold">{section.title}</h1>
      <p className="text-sm text-text-secondary">{section.videoCount} videos</p>
      {section.notes && <p className="text-sm">{section.notes}</p>}

      <button
        onClick={cycleStatus}
        className="rounded-2xl bg-background-selected p-4 text-center text-sm font-bold"
      >
        Status: {section.status.replace('_', ' ')} (tap to change)
      </button>

      {canShowSkim && (
        <div className="flex flex-col gap-2 rounded-2xl bg-background-element p-4">
          <p className="text-sm font-bold">Already know some of this?</p>
          <p className="text-sm text-text-secondary">
            Check off what you already know, then mark the section done in one tap — no need to
            open all {section.videoCount} videos.
          </p>
          {SKIM_SUBGROUPS.map((group) => (
            <button
              key={group}
              onClick={() => toggleGroup(group)}
              className={`rounded-lg p-2 text-left text-sm ${checkedGroups.has(group) ? 'bg-background-selected' : 'bg-background'}`}
            >
              {checkedGroups.has(group) ? '✓ ' : '   '}
              {group}
            </button>
          ))}
          <button
            disabled={checkedGroups.size === 0}
            onClick={() => setStatus(section.id, 'done')}
            className={`rounded-2xl p-4 text-center text-sm font-bold disabled:opacity-50 ${checkedGroups.size === 0 ? 'bg-background-element' : 'bg-background-selected'}`}
          >
            Mark section done
          </button>
        </div>
      )}

      {section.status === 'done' && (
        <>
          <h2 className="text-2xl font-semibold">Quiz</h2>
          {flaggedSectionIds.has(section.id) && (
            <p className="text-sm text-text-secondary">Worth a second pass before moving on.</p>
          )}
          <QuizPlayer questions={questions} onSubmit={handleSubmitQuiz} />
        </>
      )}
    </main>
  );
}
