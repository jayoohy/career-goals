'use client';

import { useEffect, useState } from 'react';

import type { QuizAttempt, QuizQuestion } from '@/types/models';
import { celebrate, tick } from '@/utils/feedback';

interface QuizPlayerProps {
  questions: QuizQuestion[];
  onSubmit: (answers: number[]) => Promise<QuizAttempt>;
}

/** Tier 1 static-bank MCQ flow (PRD §7.1) — informational only, never gating. */
export function QuizPlayer({ questions, onSubmit }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // `questions` arrives async from useQuiz — resize the answer slots to match once it loads
  // (a plain useState initializer would stay stuck at the empty first-render value, which made
  // the quiz submit an empty answer set the moment it appeared).
  useEffect(() => {
    setAnswers(questions.map(() => null));
    setResult(null);
  }, [questions]);

  const allAnswered = answers.length === questions.length && answers.every((a) => a !== null);

  function selectAnswer(questionIndex: number, optionIndex: number) {
    if (result) return;
    setAnswers((prev) => prev.map((a, i) => (i === questionIndex ? optionIndex : a)));
  }

  async function handleSubmit() {
    if (!allAnswered) return;
    setSubmitting(true);
    try {
      const attempt = await onSubmit(answers as number[]);
      setResult(attempt);
      if (attempt.flaggedForReview) tick();
      else celebrate();
    } finally {
      setSubmitting(false);
    }
  }

  if (questions.length === 0) {
    return <p className="text-sm">No questions for this section yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {questions.map((question, qIndex) => (
        <div key={question.id} className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
          <p className="font-heading font-semibold">{question.prompt}</p>
          {question.options.map((option, oIndex) => {
            const isSelected = answers[qIndex] === oIndex;
            const isCorrect = result && oIndex === question.correctIndex;
            const isWrongSelected = result && isSelected && oIndex !== question.correctIndex;
            return (
              <button
                key={oIndex}
                onClick={() => selectAnswer(qIndex, oIndex)}
                className={`rounded-xl p-3 text-left text-sm ${isSelected ? 'bg-primary text-on-primary' : 'bg-background'} ${
                  isCorrect ? 'border-2 border-primary' : ''
                } ${isWrongSelected ? 'border-2 border-destructive' : ''}`}
              >
                {option}
              </button>
            );
          })}
          {result && <p className="text-sm text-text-secondary">{question.explanation}</p>}
        </div>
      ))}

      {!result ? (
        <button
          disabled={!allAnswered || submitting}
          onClick={handleSubmit}
          className={`rounded-2xl p-4 text-center font-heading font-semibold disabled:opacity-50 ${allAnswered ? 'bg-primary text-on-primary' : 'bg-surface'}`}
        >
          Submit quiz
        </button>
      ) : (
        <div className="flex flex-col gap-1 rounded-2xl bg-surface p-4 animate-pop-in">
          <p className="font-heading font-semibold">
            {result.correctCount}/{result.totalQuestions} correct
          </p>
          {result.flaggedForReview && (
            <p className="text-sm text-text-secondary">Worth a second pass before moving on.</p>
          )}
        </div>
      )}
    </div>
  );
}
