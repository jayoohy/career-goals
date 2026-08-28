'use client';

import { useCallback, useEffect, useState } from 'react';

import { getQuestionsForSection, submitQuizAttempt } from '@/services/quizService';
import type { QuizAttempt, QuizQuestion } from '@/types/models';
import { todayLocalDate } from '@/utils/dateUtils';

export function useQuiz(sectionId: string) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setQuestions(await getQuestionsForSection(sectionId));
    } finally {
      setLoading(false);
    }
  }, [sectionId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const submit = useCallback(
    async (answers: number[]): Promise<QuizAttempt> => {
      return submitQuizAttempt({ sectionId, date: todayLocalDate(), answers });
    },
    [sectionId],
  );

  return { questions, loading, refresh, submit };
}
