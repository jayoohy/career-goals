import { db } from '@/services/db';
import type { QuizQuestion } from '@/types/models';

import {
  FLAG_THRESHOLD,
  getAttemptsForSection,
  getLatestFlaggedAttempts,
  getQuestionsForSection,
  submitQuizAttempt,
} from './quizService';

const seedQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    sectionId: 'section-a',
    prompt: 'Q1',
    options: ['a', 'b', 'c', 'd'],
    correctIndex: 0,
    explanation: 'because a',
  },
  {
    id: 'q2',
    sectionId: 'section-a',
    prompt: 'Q2',
    options: ['a', 'b', 'c', 'd'],
    correctIndex: 1,
    explanation: 'because b',
  },
  {
    id: 'q3',
    sectionId: 'section-a',
    prompt: 'Q3',
    options: ['a', 'b', 'c', 'd'],
    correctIndex: 2,
    explanation: 'because c',
  },
];

beforeEach(async () => {
  await db.quizQuestions.clear();
  await db.quizAttempts.clear();
  await db.quizQuestions.bulkAdd(seedQuestions);
});

describe('getQuestionsForSection', () => {
  it('returns the questions for the section', async () => {
    const questions = await getQuestionsForSection('section-a');
    expect(questions).toHaveLength(3);
    expect(questions[0].options).toEqual(['a', 'b', 'c', 'd']);
  });
});

describe('submitQuizAttempt', () => {
  it('scores correctly and does not flag a passing attempt', async () => {
    // Correct answers are indices [0, 1, 2] — answering all 3 correctly is 100%.
    const attempt = await submitQuizAttempt({
      sectionId: 'section-a',
      date: '2026-08-21',
      answers: [0, 1, 2],
    });
    expect(attempt.correctCount).toBe(3);
    expect(attempt.totalQuestions).toBe(3);
    expect(attempt.score).toBe(1);
    expect(attempt.flaggedForReview).toBe(false);
  });

  it('flags an attempt scoring below the threshold', async () => {
    // Only the first answer is correct: 1/3 ≈ 0.33, below FLAG_THRESHOLD (0.6).
    const attempt = await submitQuizAttempt({
      sectionId: 'section-a',
      date: '2026-08-21',
      answers: [0, 0, 0],
    });
    expect(attempt.score).toBeLessThan(FLAG_THRESHOLD);
    expect(attempt.flaggedForReview).toBe(true);
  });

  it('persists the attempt so it can be read back', async () => {
    await submitQuizAttempt({ sectionId: 'section-a', date: '2026-08-21', answers: [0, 1, 2] });
    const attempts = await getAttemptsForSection('section-a');
    expect(attempts.length).toBeGreaterThan(0);
    expect(attempts[0].sectionId).toBe('section-a');
  });
});

describe('getLatestFlaggedAttempts', () => {
  it('returns only the most recent attempt per section when it is flagged', async () => {
    await submitQuizAttempt({ sectionId: 'section-a', date: '2026-08-19', answers: [0, 0, 0] }); // flagged, older
    await submitQuizAttempt({ sectionId: 'section-a', date: '2026-08-20', answers: [0, 1, 2] }); // passing, newer

    const flagged = await getLatestFlaggedAttempts();
    expect(flagged.find((a) => a.sectionId === 'section-a')).toBeUndefined();
  });
});
