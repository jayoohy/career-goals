'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

import { QuizPlayer } from '@/components/QuizPlayer';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useFlaggedSections } from '@/hooks/useFlaggedSections';
import { useQuiz } from '@/hooks/useQuiz';
import type { QuizAttempt } from '@/types/models';

export default function SectionQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { sections } = useCourseSections();
  const section = sections.find((s) => s.id === id);
  const { questions, submit } = useQuiz(id);
  const { refresh: refreshFlags } = useFlaggedSections();

  async function handleSubmit(answers: number[]): Promise<QuizAttempt> {
    const attempt = await submit(answers);
    await refreshFlags();
    return attempt;
  }

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <button onClick={() => router.push(`/course/${id}`)} className="self-start text-sm text-text-secondary">
        ← Back to section
      </button>
      <h1 className="font-heading text-3xl font-bold">{section?.title ?? 'Quiz'}</h1>
      <p className="text-sm text-text-secondary">
        A quick check, not a gate — this doesn&apos;t block your progress either way.
      </p>
      <QuizPlayer questions={questions} onSubmit={handleSubmit} />
    </main>
  );
}
