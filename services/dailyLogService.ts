import { db } from '@/services/db';
import type { DailyLog, LinkedItemKind } from '@/types/models';
import { todayLocalDate } from '@/utils/dateUtils';

/** A day can only be logged "studied" at or above this floor (PRD §6.1). Below it, day-close treats it as unlogged. */
export const MIN_STUDIED_MINUTES = 10;

export async function getLogForDate(date: string): Promise<DailyLog | null> {
  const log = await db.dailyLogs.get(date);
  return log ?? null;
}

export async function getLogsInRange(startDate: string, endDate: string): Promise<DailyLog[]> {
  return db.dailyLogs.where('date').between(startDate, endDate, true, true).sortBy('date');
}

/** Total minutes across every studied day ever logged — for the "total hours logged" stat (PRD §6). */
export async function getTotalStudiedMinutes(): Promise<number> {
  const studiedLogs = await db.dailyLogs.where('type').equals('studied').toArray();
  return studiedLogs.reduce((total, log) => total + (log.durationMinutes ?? 0), 0);
}

export interface CreateStudiedLogInput {
  date: string;
  linkedItemId: string;
  linkedItemKind: LinkedItemKind;
  durationMinutes: number;
  notes?: string | null;
}

/** Throws if `durationMinutes` is below the 10-minute floor (PRD §6.1). */
export async function createStudiedLog(input: CreateStudiedLogInput): Promise<DailyLog> {
  if (input.durationMinutes < MIN_STUDIED_MINUTES) {
    throw new Error(
      `A studied day needs at least ${MIN_STUDIED_MINUTES} minutes logged (got ${input.durationMinutes}).`,
    );
  }

  const log: DailyLog = {
    date: input.date,
    type: 'studied',
    linkedItemId: input.linkedItemId,
    linkedItemKind: input.linkedItemKind,
    durationMinutes: input.durationMinutes,
    notes: input.notes ?? null,
  };
  await db.dailyLogs.put(log);
  return log;
}

/** Throws unless `date` is today — rest days are same-day-only, no pre-marking (PRD §5). */
export async function createRestLog(date: string, notes?: string | null): Promise<DailyLog> {
  if (date !== todayLocalDate()) {
    throw new Error('Rest days can only be marked for today, not in advance.');
  }

  const log: DailyLog = {
    date,
    type: 'rest',
    linkedItemId: null,
    linkedItemKind: null,
    durationMinutes: null,
    notes: notes ?? null,
  };
  await db.dailyLogs.put(log);
  return log;
}

/** System-generated at day-close (PRD §5) — not a user action, so no floor/same-day validation applies. */
export async function createMissedLog(date: string): Promise<DailyLog> {
  const log: DailyLog = {
    date,
    type: 'missed',
    linkedItemId: null,
    linkedItemKind: null,
    durationMinutes: null,
    notes: null,
  };
  await db.dailyLogs.put(log);
  return log;
}
