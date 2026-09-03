export type CourseSectionStatus = 'not_started' | 'in_progress' | 'done' | 'skipped';

export interface CourseSection {
  id: string;
  title: string;
  videoCount: number;
  durationMinutes: number;
  /**
   * Auto-managed, not user-set directly (see courseSectionService.recomputeSectionStatus):
   * derived from lesson completion and logged time, except 'skipped' which is an explicit,
   * separate user action. There's no "tap to cycle through states" control anymore — that was
   * confusing (users could accidentally cycle a whole section to "done" without doing the work).
   */
  status: CourseSectionStatus;
  skimFlag: boolean;
  sortOrder: number;
  notes: string | null;
}

/** One video/lecture within a CourseSection — the actual unit of progress (a section can have 40+). */
export interface CourseLesson {
  id: string;
  sectionId: string;
  title: string;
  order: number;
  done: boolean;
}

/** Singleton (id: 1) — course-level info shown on the Course tab header. */
export interface CourseMeta {
  title: string;
  tutor: string;
  url: string;
  description: string;
}

export type RoadmapSource = 'fastai' | 'cs231n' | 'coursera' | 'project' | 'career' | 'reference';
export type RoadmapItemStatus = 'not_started' | 'in_progress' | 'done' | 'deferred';

/**
 * Which segmented progress bar (§6, post-v2) an item counts toward. 'course' is included for
 * completeness with the PRD's field spec, though Layer 1 progress is actually computed from
 * `CourseSection`, not `RoadmapItem` — no seeded Layer 2 item currently uses it.
 */
export type RoadmapSectionGroup =
  'course' | 'core_skills' | 'robotics_track' | 'portfolio' | 'deployment' | 'career';

/**
 * One checklist step inside a RoadmapItem — the roadmap equivalent of a CourseLesson inside a
 * CourseSection. Built-in items ship with a starter set (see data/seed/roadmapSubSteps.ts);
 * Joy can add, rename, check, or remove any of them, and items she adds herself start with none.
 */
export interface RoadmapSubStep {
  id: string;
  itemId: string;
  title: string;
  order: number;
  done: boolean;
  /** True for the seeded starter steps — purely informational (lets the UI hint "you can edit these"). */
  seeded: boolean;
}

export interface RoadmapItem {
  id: string;
  title: string;
  source: RoadmapSource;
  sectionGroup: RoadmapSectionGroup;
  description: string;
  estimatedHours: number;
  sequencePosition: number;
  /**
   * Derived from the item's sub-steps once it has any (all done → done, some → in_progress),
   * mirroring CourseSection. 'deferred' is the exception — an explicit "set aside" action,
   * cleared automatically when a sub-step is checked. Items with no sub-steps fall back to a
   * manual done / not-done toggle on the detail page.
   */
  status: RoadmapItemStatus;
  /** True for items (e.g. deployment/edge optimization) that thread through multiple projects rather than completing once — tracked separately, not gating the sequence (PRD §4). */
  isOngoing: boolean;
  /** Marks this item as part of the job-ready floor (PRD §4.3) — strengthening items past the floor leave this false. */
  jobReadyThreshold: boolean;
  userAdded: boolean;
}

export type DailyLogType = 'studied' | 'rest' | 'missed';
export type LinkedItemKind = 'course_section' | 'roadmap_item';

/** One logged study session. A day can have several — logging more time later the same day adds a session rather than overwriting the first. */
export interface StudySession {
  linkedItemId: string;
  linkedItemKind: LinkedItemKind;
  durationMinutes: number;
  loggedAt: string; // ISO timestamp — for ordering/display within the day
}

export interface DailyLog {
  date: string; // YYYY-MM-DD, local day, primary key
  type: DailyLogType;
  sessions: StudySession[]; // empty for rest/missed days
  notes: string | null;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastLoggedDate: string | null; // YYYY-MM-DD
  /** True after a reset to 0, until the next app open has shown the one-line streak-break message (§6.1). */
  streakBrokenPendingAck: boolean;
}

export interface RestDayBudget {
  month: string; // YYYY-MM
  cap: number;
  usedCount: number;
}

export interface QuizQuestion {
  id: string;
  sectionId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizAttempt {
  id: string;
  sectionId: string;
  date: string; // YYYY-MM-DD
  correctCount: number;
  totalQuestions: number;
  score: number; // correctCount / totalQuestions, 0..1
  answers: number[]; // selected option index per question, in question order
  flaggedForReview: boolean;
}

export interface NotificationConfig {
  windowStart: string; // "HH:MM", default "19:00"
  windowEnd: string; // "HH:MM", default "20:00"
  hardDeadline: string; // "HH:MM", default "22:00"
  remindersEnabled: boolean;
  weeklyReviewEnabled: boolean;
}

/** Tracks whether the one-time job-ready notification (PRD §4.3) has fired. The job-ready state itself is derived, never stored — see `isJobReady()` in milestoneService. */
export interface MilestoneState {
  jobReadyNotified: boolean;
}

/**
 * Server-side only (PRD "Push notifications" §4/§7) — the browser's PushSubscription object,
 * stored in Upstash Redis so the cron routes can send to Joy's device. Single record, no user
 * table, since this remains a single-user app.
 */
export interface PushSubscriptionRecord {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Server-side only — the minimal daily-log status the client syncs to Redis on every log
 * entry, so the cron routes know whether to send an escalation notification without needing
 * the full local dataset (PRD requirement 28).
 */
export interface DayLogSyncFlag {
  date: string; // YYYY-MM-DD, local day
  logged: boolean;
}

/**
 * Whole-database backup (Option A) — a JSON snapshot of the client's entire Dexie database,
 * stored under one Redis key so a wiped or second device can pull the data back. Single user,
 * last-write-wins by `updatedAt`. Shape is owned by services/syncService.ts.
 */
export interface StateSnapshot {
  updatedAt: number; // epoch ms of the client change that produced this snapshot
  deviceId: string; // opaque per-device id, so a device recognises its own push coming back
  tables: Record<string, unknown[]>; // { [dexieTableName]: rows[] }
}
