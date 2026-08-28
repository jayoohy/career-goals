import Dexie, { type Table } from 'dexie';

import { courseSectionsSeed } from '@/data/seed/courseSections';
import { quizQuestionsSeed } from '@/data/seed/quizQuestions';
import { roadmapItemsSeed } from '@/data/seed/roadmapItems';
import type {
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

/** Singleton rows (streak/notification-config/milestone) use a fixed `id: 1` key, mirroring the `CHECK (id = 1)` singleton-table pattern from the original SQLite schema. */
type SingletonRow<T> = T & { id: 1 };

class CareerGoalsDatabase extends Dexie {
  courseSections!: Table<CourseSection, string>;
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
  }
}

export const db = new CareerGoalsDatabase();

async function seedIfEmpty(): Promise<void> {
  const existingCount = await db.courseSections.count();
  if (existingCount > 0) {
    return;
  }

  await db.transaction(
    'rw',
    [
      db.courseSections,
      db.roadmapItems,
      db.quizQuestions,
      db.streakState,
      db.notificationConfig,
      db.restDayBudgets,
      db.milestoneState,
    ],
    async () => {
      await db.courseSections.bulkAdd(courseSectionsSeed);
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

/** Opens the database (creating the schema on first run, via Dexie's versioned stores) and seeds fixed content if empty. Call once at app start. */
export function initDatabase(): Promise<void> {
  if (!initPromise) {
    initPromise = seedIfEmpty();
  }
  return initPromise;
}
