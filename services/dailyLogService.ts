import { syncLessonsToLoggedTime } from '@/services/courseLessonService';
import { markSectionTouchedByLogging } from '@/services/courseSectionService';
import { syncSubStepsToLoggedTime } from '@/services/roadmapSubStepService';
import { db } from '@/services/db';
import type { DailyLog, LinkedItemKind, StudySession } from '@/types/models';
import { todayLocalDate } from '@/utils/dateUtils';

/** A day only counts as "studied" once its sessions add up to this floor (PRD §6.1) — checked against the day's total, not any single session, since a day can now have several. */
export const MIN_STUDIED_MINUTES = 10;

export async function getLogForDate(date: string): Promise<DailyLog | null> {
  const log = await db.dailyLogs.get(date);
  return log ?? null;
}

export async function getLogsInRange(startDate: string, endDate: string): Promise<DailyLog[]> {
  return db.dailyLogs.where('date').between(startDate, endDate, true, true).sortBy('date');
}

export function totalMinutesForLog(log: DailyLog): number {
  // `?? []` guards against any legacy row that predates the sessions[] migration.
  return (log.sessions ?? []).reduce((sum, session) => sum + session.durationMinutes, 0);
}

/** True once a day's logged sessions add up to the studied floor — the signal `useDailyLog` uses to decide whether to record the streak/day-status for today. */
export function meetsStudiedFloor(log: DailyLog): boolean {
  return totalMinutesForLog(log) >= MIN_STUDIED_MINUTES;
}

/** Total minutes across every studied day ever logged — for the "total hours logged" stat (PRD §6). */
export async function getTotalStudiedMinutes(): Promise<number> {
  const studiedLogs = await db.dailyLogs.where('type').equals('studied').toArray();
  return studiedLogs.reduce((total, log) => total + totalMinutesForLog(log), 0);
}

/** Total minutes ever logged against one specific item (a course section or roadmap item) — drives the "you've logged enough time for this section" quiz nudge. */
export async function getTotalMinutesForItem(linkedItemId: string): Promise<number> {
  const studiedLogs = await db.dailyLogs.where('type').equals('studied').toArray();
  return studiedLogs.reduce(
    (total, log) =>
      total +
      (log.sessions ?? [])
        .filter((session) => session.linkedItemId === linkedItemId)
        .reduce((sum, session) => sum + session.durationMinutes, 0),
    0,
  );
}

export interface AddStudySessionInput {
  date: string;
  linkedItemId: string;
  linkedItemKind: LinkedItemKind;
  durationMinutes: number;
}

/**
 * Adds a study session to the day's log, creating the log if this is the first session today.
 * Logging more time later the same day appends another session rather than overwriting —
 * there's no "you can only log once a day" limit anymore.
 */
export async function addStudySession(input: AddStudySessionInput): Promise<DailyLog> {
  if (input.durationMinutes <= 0) {
    throw new Error('Duration must be greater than 0 minutes.');
  }

  const existing = await db.dailyLogs.get(input.date);
  if (existing?.type === 'rest') {
    throw new Error("Today's already marked as a rest day.");
  }

  const session: StudySession = {
    linkedItemId: input.linkedItemId,
    linkedItemKind: input.linkedItemKind,
    durationMinutes: input.durationMinutes,
    loggedAt: new Date().toISOString(),
  };

  const next: DailyLog = existing
    ? { ...existing, type: 'studied', sessions: [...(existing.sessions ?? []), session] }
    : { date: input.date, type: 'studied', sessions: [session], notes: null };

  await db.dailyLogs.put(next);

  if (input.linkedItemKind === 'course_section') {
    await markSectionTouchedByLogging(input.linkedItemId);
    await syncLessonsToLoggedTime(
      input.linkedItemId,
      await getTotalMinutesForItem(input.linkedItemId),
    );
  } else if (input.linkedItemKind === 'roadmap_item') {
    await syncSubStepsToLoggedTime(
      input.linkedItemId,
      await getTotalMinutesForItem(input.linkedItemId),
    );
  }

  return next;
}

/** Throws unless `date` is today — rest days are same-day-only, no pre-marking (PRD §5). */
export async function createRestLog(date: string, notes?: string | null): Promise<DailyLog> {
  if (date !== todayLocalDate()) {
    throw new Error('Rest days can only be marked for today, not in advance.');
  }

  const log: DailyLog = { date, type: 'rest', sessions: [], notes: notes ?? null };
  await db.dailyLogs.put(log);
  return log;
}

/** System-generated at day-close (PRD §5) — not a user action, so no floor/same-day validation applies. */
export async function createMissedLog(date: string): Promise<DailyLog> {
  const log: DailyLog = { date, type: 'missed', sessions: [], notes: null };
  await db.dailyLogs.put(log);
  return log;
}
