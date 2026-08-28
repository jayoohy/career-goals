export type CourseSectionStatus = 'not_started' | 'in_progress' | 'done' | 'skipped';

export interface CourseSection {
  id: string;
  title: string;
  videoCount: number;
  durationMinutes: number;
  status: CourseSectionStatus;
  skimFlag: boolean;
  sortOrder: number;
  notes: string | null;
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

export interface RoadmapItem {
  id: string;
  title: string;
  source: RoadmapSource;
  sectionGroup: RoadmapSectionGroup;
  description: string;
  estimatedHours: number;
  sequencePosition: number;
  status: RoadmapItemStatus;
  /** True for items (e.g. deployment/edge optimization) that thread through multiple projects rather than completing once — tracked separately, not gating the sequence (PRD §4). */
  isOngoing: boolean;
  /** Marks this item as part of the job-ready floor (PRD §4.3) — strengthening items past the floor leave this false. */
  jobReadyThreshold: boolean;
  userAdded: boolean;
}

export type DailyLogType = 'studied' | 'rest' | 'missed';
export type LinkedItemKind = 'course_section' | 'roadmap_item';

export interface DailyLog {
  date: string; // YYYY-MM-DD, local day, primary key
  type: DailyLogType;
  linkedItemId: string | null;
  linkedItemKind: LinkedItemKind | null;
  durationMinutes: number | null;
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
