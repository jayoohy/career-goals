import { db } from '@/services/db';
import type { QuizAttempt, QuizQuestion } from '@/types/models';
import { generateId } from '@/utils/id';

/** Below this score, an attempt is flagged "worth another look" (PRD §7.1) — informational only, never gating. */
export const FLAG_THRESHOLD = 0.6;

export async function getQuestionsForSection(sectionId: string): Promise<QuizQuestion[]> {
  return db.quizQuestions.where('sectionId').equals(sectionId).toArray();
}

export interface SubmitQuizAttemptInput {
  sectionId: string;
  date: string;
  /** Selected option index per question, in the same order as `getQuestionsForSection` returned them. */
  answers: number[];
}

/** Scores the attempt against the section's question bank and persists it. Non-gating — a low score only sets `flaggedForReview`. */
export async function submitQuizAttempt(input: SubmitQuizAttemptInput): Promise<QuizAttempt> {
  const questions = await getQuestionsForSection(input.sectionId);
  const totalQuestions = questions.length;
  const correctCount = questions.reduce(
    (count, question, index) =>
      input.answers[index] === question.correctIndex ? count + 1 : count,
    0,
  );
  const score = totalQuestions > 0 ? correctCount / totalQuestions : 0;

  const attempt: QuizAttempt = {
    id: generateId('quiz-attempt'),
    sectionId: input.sectionId,
    date: input.date,
    correctCount,
    totalQuestions,
    score,
    answers: input.answers,
    flaggedForReview: score < FLAG_THRESHOLD,
  };

  await db.quizAttempts.add(attempt);
  return attempt;
}

export async function getAttemptsForSection(sectionId: string): Promise<QuizAttempt[]> {
  const attempts = await db.quizAttempts.where('sectionId').equals(sectionId).toArray();
  return attempts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** The most recent attempt per section that is currently flagged — surfaced in the weekly review (§7.1). */
export async function getLatestFlaggedAttempts(): Promise<QuizAttempt[]> {
  const all = await db.quizAttempts.toArray();
  const sorted = all.sort((a, b) => (a.date < b.date ? 1 : -1));
  const latestBySection = new Map<string, QuizAttempt>();
  for (const attempt of sorted) {
    if (!latestBySection.has(attempt.sectionId)) {
      latestBySection.set(attempt.sectionId, attempt);
    }
  }
  return Array.from(latestBySection.values()).filter((attempt) => attempt.flaggedForReview);
}
