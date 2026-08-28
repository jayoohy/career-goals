'use client';

import { useState } from 'react';

import type { QuizAttempt, QuizQuestion } from '@/types/models';

interface QuizPlayerProps {
  questions: QuizQuestion[];
  onSubmit: (answers: number[]) => Promise<QuizAttempt>;
}

/** Tier 1 static-bank MCQ flow (PRD §7.1) — informational only, never gating. */
export function QuizPlayer({ questions, onSubmit }: QuizPlayerProps) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => questions.map(() => null));
  const [result, setResult] = useState<QuizAttempt | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const allAnswered = answers.every((a) => a !== null);

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
        <div key={question.id} className="flex flex-col gap-2 rounded-2xl bg-background-element p-4">
          <p className="text-sm font-bold">{question.prompt}</p>
          {question.options.map((option, oIndex) => {
            const isSelected = answers[qIndex] === oIndex;
            const isCorrect = result && oIndex === question.correctIndex;
            const isWrongSelected = result && isSelected && oIndex !== question.correctIndex;
            return (
              <button
                key={oIndex}
                onClick={() => selectAnswer(qIndex, oIndex)}
                className={`rounded-lg p-2 text-left text-sm ${isSelected ? 'bg-background-selected' : 'bg-background'} ${
                  isCorrect ? 'border border-[#3ba55c]' : ''
                } ${isWrongSelected ? 'border border-[#e5534b]' : ''}`}
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
          className={`rounded-2xl p-4 text-center text-sm font-bold disabled:opacity-50 ${allAnswered ? 'bg-background-selected' : 'bg-background-element'}`}
        >
          Submit quiz
        </button>
      ) : (
        <div className="flex flex-col gap-1 rounded-2xl bg-background-element p-4">
          <p className="text-sm font-bold">
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
