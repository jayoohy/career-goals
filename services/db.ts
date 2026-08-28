import Dexie, { type Table } from 'dexie';

import { courseLessonsSeed } from '@/data/seed/courseLessons';
import { courseMetaSeed } from '@/data/seed/courseMeta';
import { courseSectionsSeed } from '@/data/seed/courseSections';
import { quizQuestionsSeed } from '@/data/seed/quizQuestions';
import { roadmapItemsSeed } from '@/data/seed/roadmapItems';
import type {
  CourseLesson,
  CourseMeta,
  CourseSection,
  DailyLog,
  MilestoneState,
  NotificationConfig,
  QuizAttempt,
  QuizQuestion,
  RestDayBudget,
  RoadmapItem,
  StreakState,
} from '@/types/models';
import { currentMonthKey, todayLocalDate } from '@/utils/dateUtils';

/** Singleton rows (streak/notification-config/milestone/course-meta) use a fixed `id: 1` key, mirroring the `CHECK (id = 1)` singleton-table pattern from the original SQLite schema. */
type SingletonRow<T> = T & { id: 1 };

class CareerGoalsDatabase extends Dexie {
  courseSections!: Table<CourseSection, string>;
  courseLessons!: Table<CourseLesson, string>;
  courseMeta!: Table<SingletonRow<CourseMeta>, number>;
  roadmapItems!: Table<RoadmapItem, string>;
  dailyLogs!: Table<DailyLog, string>;
  streakState!: Table<SingletonRow<StreakState>, number>;
  restDayBudgets!: Table<RestDayBudget, string>;
  quizQuestions!: Table<QuizQuestion, string>;
  quizAttempts!: Table<QuizAttempt, string>;
  notificationConfig!: Table<SingletonRow<NotificationConfig>, number>;
  milestoneState!: Table<SingletonRow<MilestoneState>, number>;

  constructor() {
    super('career_goals');

    // v1 — original schema (kept, unmodified, so Dexie can replay the upgrade path for anyone
    // who already has v1 data, e.g. from before this redesign).
    this.version(1).stores({
      courseSections: 'id, sortOrder, status',
      roadmapItems: 'id, sequencePosition, sectionGroup, status',
      dailyLogs: 'date, type',
      streakState: 'id',
      restDayBudgets: 'month',
      quizQuestions: 'id, sectionId',
      quizAttempts: 'id, sectionId, date',
      notificationConfig: 'id',
      milestoneState: 'id',
    });

    // v2 — adds per-lesson tracking (courseLessons) and course metadata (courseMeta), and
    // reshapes DailyLog from one-session-per-day to a `sessions[]` array (multi-session days).
    this.version(2)
      .stores({
        courseSections: 'id, sortOrder, status',
        courseLessons: 'id, sectionId, order',
        courseMeta: 'id',
        roadmapItems: 'id, sequencePosition, sectionGroup, status',
        dailyLogs: 'date, type',
        streakState: 'id',
        restDayBudgets: 'month',
        quizQuestions: 'id, sectionId',
        quizAttempts: 'id, sectionId, date',
        notificationConfig: 'id',
        milestoneState: 'id',
      })
      .upgrade(async (tx) => {
        // Old rows had flat linkedItemId/linkedItemKind/durationMinutes fields; wrap them into a
        // single-item sessions[] array so multi-session days can be added going forward without
        // losing already-logged time.
        await tx
          .table('dailyLogs')
          .toCollection()
          .modify((log) => {
            const legacy = log as unknown as {
              sessions?: unknown;
              linkedItemId?: string | null;
              linkedItemKind?: string | null;
              durationMinutes?: number | null;
            };
            if (legacy.sessions) {
              return;
            }
            legacy.sessions = legacy.linkedItemId
              ? [
                  {
                    linkedItemId: legacy.linkedItemId,
                    linkedItemKind: legacy.linkedItemKind,
                    durationMinutes: legacy.durationMinutes,
                    loggedAt: new Date().toISOString(),
                  },
                ]
              : [];
            delete legacy.linkedItemId;
            delete legacy.linkedItemKind;
            delete legacy.durationMinutes;
          });
      });
  }
}

export const db = new CareerGoalsDatabase();

async function seedIfEmpty(): Promise<void> {
  const existingCount = await db.courseSections.count();
  if (existingCount > 0) {
    // Still backfill lessons/meta for anyone who seeded under v1 (courseSections existed, but
    // courseLessons/courseMeta didn't yet).
    if ((await db.courseLessons.count()) === 0) {
      await db.courseLessons.bulkAdd(courseLessonsSeed);
    }
    if ((await db.courseMeta.count()) === 0) {
      await db.courseMeta.add({ id: 1, ...courseMetaSeed });
    }
    return;
  }

  await db.transaction(
    'rw',
    [
      db.courseSections,
      db.courseLessons,
      db.courseMeta,
      db.roadmapItems,
      db.quizQuestions,
      db.streakState,
      db.notificationConfig,
      db.restDayBudgets,
      db.milestoneState,
    ],
    async () => {
      await db.courseSections.bulkAdd(courseSectionsSeed);
      await db.courseLessons.bulkAdd(courseLessonsSeed);
      await db.courseMeta.add({ id: 1, ...courseMetaSeed });
      await db.roadmapItems.bulkAdd(roadmapItemsSeed);
      await db.quizQuestions.bulkAdd(quizQuestionsSeed);

      await db.streakState.add({
        id: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastLoggedDate: null,
        streakBrokenPendingAck: false,
      });

      await db.notificationConfig.add({
        id: 1,
        windowStart: '19:00',
        windowEnd: '20:00',
        hardDeadline: '22:00',
        remindersEnabled: true,
        weeklyReviewEnabled: true,
      });

      await db.restDayBudgets.add({
        month: currentMonthKey(todayLocalDate()),
        cap: 4,
        usedCount: 0,
      });

      await db.milestoneState.add({ id: 1, jobReadyNotified: false });
    },
  );
}

let initPromise: Promise<void> | null = null;

/** Opens the database (creating/upgrading the schema via Dexie's versioned stores) and seeds fixed content if empty. Call once at app start. */
export function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = seedIfEmpty();
  }
  return initPromise;
}
