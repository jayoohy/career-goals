## Relevant Files

- `src/app/_layout.tsx` - Root layout (Expo Router); gates rendering on `initDatabase()` resolving (keeps native splash up until seeded), then renders `AppTabs`.
- `src/components/app-tabs.tsx` - Native tab bar (`NativeTabs`, iOS/Android) — 5 triggers (Today/Course/Roadmap/Progress/Settings) using `sf`/`md` icon names, no image assets needed.
- `src/components/app-tabs.web.tsx` - Web-platform tab bar (`expo-router/ui` `Tabs`/`TabList`), same 5 routes — Metro resolves this over `app-tabs.tsx` on web via the `.web.tsx` suffix.
- `src/app/index.tsx` - Today screen: streak badge, today's log status, opens `DailyLogModal`.
- `src/app/course/_layout.tsx` - Nested `Stack` for the Course tab, so section detail pushes over the tab bar instead of replacing it (confirmed via Expo Router docs — `NativeTabs` triggers point at a directory, whose own `_layout.tsx` owns sub-navigation).
- `src/app/course/index.tsx` - Layer 1 course tracker screen (composes `SectionCard` list).
- `src/app/course/[id].tsx` - Section detail: status cycling, §4.1 skim bulk-mark UI for Section 1, quiz entry point once `status === 'done'`.
- `src/app/roadmap.tsx` - Layer 2 roadmap screen (composes `RoadmapItemCard` list, lock state, reorder via up/down — no drag-gesture library installed, so "drag-to-reorder" is implemented as move-up/move-down buttons).
- `src/app/progress.tsx` - Progress screen: stats card, `JobReadyBadge`, `PathProgressMap`, `SegmentedProgressBars`, `WeeklyReviewCard`.
- `src/app/settings.tsx` - Notification window config, rest-day cap, other adjustable settings.
- `src/components/NotificationEffects.tsx` - Mounted once in `_layout.tsx`: runs `useNotificationScheduler` and listens for notification taps to deep-link (`/?openLog=1` or `/progress`).
- `src/components/DailyLogModal.tsx` - Studied/rest/missed logging UI, enforces 10-min floor and rest-day cap in the UI layer.
- `src/components/StreakBadge.tsx` - Current/longest streak display, renders streak-break message per §6.1.
- `src/components/SectionCard.tsx` - Single course section row/card with status, skim indicator, and a "worth a revisit" pill when the section's latest quiz is flagged.
- `src/components/RoadmapItemCard.tsx` - Single Layer 2 item row/card with locked/unlocked state.
- `src/components/PathProgressMap.tsx` - Route/waypoint visual for overall path progress, alongside (not replacing) the segmented per-group bars.
- `src/components/SegmentedProgressBars.tsx` - Layer 1 course bar + one bar per `RoadmapItem.section_group` (core_skills/robotics_track/portfolio/deployment/career), per PRD §6 post-v2.
- `src/components/JobReadyBadge.tsx` - Persistent badge shown once `isJobReady()` is true (PRD §4.3) — a threshold flag, not a percentage.
- `src/components/QuizPlayer.tsx` - MCQ quiz-taking UI and score display.
- `src/components/RestDayIndicator.tsx` - "2 of 4 rest days left this month" display.
- `src/components/WeeklyReviewCard.tsx` - Sunday weekly review summary (days logged, hours, flagged quizzes, what's next).
- `src/hooks/useWeeklyReview.ts` - Computes the weekly review data (7-day log range, next-up item, flagged quiz sections) feeding `WeeklyReviewCard`.
- `src/hooks/useStreak.ts` - Reads/derives `StreakState`, exposes streak-break message flag.
- `src/hooks/useDailyLog.ts` - Today's log state, rest budget, total studied minutes, mark-studied/mark-rest/rest-cap actions.
- `src/hooks/useRoadmap.ts` - Layer 2 items + derived `roadmap_unlocked` state + `getSectionGroupProgress` results.
- `src/hooks/useCourseSections.ts` - Layer 1 sections + status mutations.
- `src/hooks/useQuiz.ts` - Quiz question fetch, attempt submission, flag derivation.
- `src/hooks/useMilestone.ts` - Derived `isJobReady()` for `JobReadyBadge`/`PathProgressMap`.
- `src/hooks/useFlaggedSections.ts` - Section ids whose latest quiz attempt is flagged (§7.1), for the `SectionCard`/section-detail badge.
- `src/hooks/useNotificationConfig.ts` - Reads/updates `NotificationConfig` for the Settings screen.
- `src/hooks/useNotificationScheduler.ts` - Schedules/cancels the day's notification set based on log state.
- `src/services/db.ts` - SQLite connection, schema creation, migrations, seed-on-first-launch.
- `src/services/courseSectionService.ts` - CRUD/status updates for `CourseSection`.
- `src/services/roadmapService.ts` - CRUD/reorder/defer for `RoadmapItem`, computes `roadmap_unlocked` and per-`section_group` progress (`getSectionGroupProgress`).
- `src/services/milestoneService.ts` - Derived `isJobReady()` (PRD §4.3: Layer 1 done + every `job_ready_threshold` item done) plus the one-time `job_ready_notified` flag (`MilestoneState`).
- `src/services/milestoneService.test.ts` - Unit tests for the job-ready derivation (floor met/not met, notified-once behavior).
- `src/services/dailyLogService.ts` - Create/read `DailyLog` entries, enforces 10-min floor, rest-day same-day-only rule.
- `src/services/streakService.ts` - Streak increment/reset logic, longest-streak tracking.
- `src/services/restDayBudgetService.ts` - Monthly cap tracking, used_count, month rollover on the 1st.
- `src/services/quizService.ts` - `QuizQuestion`/`QuizAttempt` persistence, score threshold flagging.
- `src/services/notificationConfigService.ts` - CRUD for `NotificationConfig` (data only — actual push scheduling is `notificationService.ts`, task 5.0).
- `src/services/notificationService.ts` - `expo-notifications` scheduling, permission requests, Android channel setup.
- `src/services/dayCloseService.ts` - `runDayCloseCheck()`: on app open, marks any unlogged past day `missed` and resets the streak once. Wired into `_layout.tsx` after `initDatabase()`.
- `src/services/dayCloseService.test.ts` - Unit tests for the day-close gap logic (fresh install, already-today, yesterday-still-open, multi-day gap, pre-existing log in the gap).
- `src/utils/dateUtils.ts` - Date/time helpers (local day boundaries, month keys, relative formatting).
- `src/utils/streakLogic.ts` - Pure functions for streak transitions (unit-testable in isolation).
- `src/utils/streakLogic.test.ts` - Unit tests for streak reset/increment edge cases.
- `src/services/dailyLogService.test.ts` - Unit tests for the 10-min floor and same-day-only rest rule (mocks `@/services/db`).
- `src/services/restDayBudgetService.test.ts` - Unit tests for cap enforcement and monthly rollover (stateful fake db).
- `src/services/quizService.test.ts` - Unit tests for score-threshold flagging logic.
- `src/constants/copy.ts` - All notification and weekly-review copy strings, per §7 tone rules (fixed set, no dynamic generation).
- `src/data/seed/courseSections.ts` - Seed data for the 11 Layer 1 sections from PRD §4.
- `src/data/seed/roadmapItems.ts` - Seed data for Layer 2's 14 items, resequenced for the dual CV/Robotics track (fast.ai, C++/ROS/sensor-fusion, first CV+robotics portfolio project, simulation, CS231n, Andrew Ng, SLAM, 3D vision, deployment, other portfolio candidates, DSA, career milestones) — see PRD §4/§4.3.
- `src/data/seed/quizQuestions.ts` - Seed MCQ bank, 5-8 questions per section.
- `src/types/models.ts` - Shared TypeScript types for all PRD §8 data models.

### Notes

- Framework: **Expo SDK 57 (React Native 0.86) + TypeScript**, scaffolded with `create-expo-app`'s default template — **Expo Router** (file-based, screens under `src/app/`) and **expo-sqlite** for local persistence, per PRD §9.
- Navigation uses the template's `NativeTabs` (`expo-router/unstable-native-tabs`) via `src/components/app-tabs.tsx` (+ `app-tabs.web.tsx` for web), not the older `(tabs)/` route-group convention. Confirmed via Expo Router docs: a trigger `name` can point at a directory, and that directory's own `_layout.tsx` (a `Stack`) owns any further push navigation within that tab — used for `course/[id]`.
- `react-hooks/set-state-in-effect` is disabled in `eslint.config.js` — it flags the standard fetch-on-mount hook pattern used throughout `src/hooks/`, and even fires on the untouched template's own `use-color-scheme.web.ts`, so treated as noise.
- Tutorial-only scaffold files removed once replaced: `app/explore.tsx`, `components/animated-icon*`, `components/hint-row.tsx`, `components/web-badge.tsx`, `components/external-link.tsx`, `components/ui/collapsible.tsx`.
- Verified via `npx expo export -p android` after every task (bundles cleanly throughout, 1389 modules as of 6.0) — the real target platform. `npx expo export -p web` fails on `expo-sqlite`'s WASM worker needing Metro asset config; not chased since the PRD targets mobile only (§9), not web.
- All PRD tasks (1.0-6.0) are now complete: scaffolding, data layer + seed content, screens/navigation, daily-log/streak engine, notifications/weekly-review, and quizzes. 32 Jest tests passing across 6 suites; `tsc`/`eslint` clean throughout. Not yet done: an actual on-device run (no simulator/emulator available in this environment — verification has relied on `tsc`, `eslint`, `jest`, and `expo export` bundling) — worth a real device/Expo Go pass before considering this shippable.
- Folder structure follows the code-separation rule: screens in `src/app/` only compose components; business logic lives in `src/hooks/`/`src/services/`/`src/utils/`.
- SDK 57 is new — `AGENTS.md` in the repo root flags that APIs may differ from older Expo knowledge; check https://docs.expo.dev/versions/v57.0.0/ before assuming an API shape. This extends to the toolchain itself: the project runs **TypeScript 6.0.3**, whose `moduleResolution: "bundler"` doesn't auto-include ambient `@types` packages the way older resolution modes did — Jest's globals needed an explicit `"types": ["jest"]` in `tsconfig.json` (installed via `@types/jest`) plus a `moduleNameMapper` for `@/*` in the Jest config (`package.json`'s `"jest"` field) so mocked service imports resolve.
- Test convention: since `jest.mock()` calls are hoisted above `const` declarations, any variable referenced inside a mock factory must be prefixed `mock` (Jest's escape hatch for this) — see the three service test files for the pattern (mock `@/services/db` with either a plain `jest.fn()` stub or a small stateful fake keyed by SQL substring, per what the test needs to assert).
- Use `npx jest [optional/path/to/test/file]` to run tests; running without a path executes the full suite.
- No backend/auth in v1 — all data is local-first via SQLite (PRD §9), so no slug/code-generation concerns apply.
- Git branch creation (task 0.0) intentionally omitted — repo isn't initialized yet; revisit later.
- **Post-v2 build note (folded into PRD §4/§4.3/§6):** Layer 2 resequenced for a dual CV Engineer / Robotics SWE track, added a `job_ready_threshold` floor-flag + `isJobReady()` derivation (`milestoneService.ts`), and replaced the single global progress bar with per-`section_group` segmented bars. `RoadmapItem` gained `sectionGroup`, `isOngoing`, `jobReadyThreshold`; a new `MilestoneState`/`milestone_state` table tracks the one-time job-ready notification. Task 2.0 below stays checked off — this was folded into its already-built files (`types/models.ts`, `services/db.ts`, `data/seed/roadmapItems.ts`, `services/roadmapService.ts`) rather than reopening it as new sub-tasks.

## Instructions for Completing Tasks

As each task is completed, check it off by changing `- [ ]` to `- [x]`, updating the file after each sub-task, not just after a whole parent task.

## Tasks

- [x] 1.0 Project scaffolding & tooling
  - [x] 1.1 Init Expo project with TypeScript template and Expo Router
  - [x] 1.2 Install core dependencies: `expo-sqlite`, `expo-notifications`, Expo Router deps
  - [x] 1.3 Create folder structure: `app/`, `components/`, `hooks/`, `services/`, `utils/`, `constants/`, `data/seed/`, `types/`
  - [x] 1.4 Configure `app.json` (app name, icon/splash placeholders, notification permission descriptions)
  - [x] 1.5 Set up TypeScript path aliases (e.g. `@/components`, `@/services`)
  - [x] 1.6 Set up ESLint/Prettier for consistency
  - [x] 1.7 Set up Jest + `jest-expo` preset for unit testing services/utils

- [x] 2.0 Data layer & seed content
  - [x] 2.1 Define TypeScript interfaces for all PRD §8 models in `types/models.ts` (`CourseSection`, `RoadmapItem`, `DailyLog`, `StreakState`, `RestDayBudget`, `QuizQuestion`, `QuizAttempt`, `NotificationConfig`)
  - [x] 2.2 Implement `services/db.ts`: SQLite connection, table creation/migrations, run-once seed on first launch
  - [x] 2.3 Write `data/seed/courseSections.ts` with the 11 sections from PRD §4 table, including `skim_flag` on Section 1
  - [x] 2.4 Write `data/seed/roadmapItems.ts` with the 14 resequenced Layer 2 items from PRD §4/§4.3 (dual CV/Robotics track — fast.ai, C++/ROS/sensor-fusion, first CV+robotics portfolio project, simulation, CS231n, Andrew Ng, SLAM, 3D vision, deployment, other portfolio candidates, DSA, career milestones), each with `sequence_position`, `sectionGroup`, `isOngoing`, `jobReadyThreshold`, and `user_added: false`
  - [x] 2.5 Author `data/seed/quizQuestions.ts`: 5-8 MCQs per course section (use an LLM once during development per PRD §7.1 build tip, then hand-review before committing)
  - [x] 2.6 Implement `services/courseSectionService.ts` (get all, update status, bulk skim-mark for Section 1 sub-groups per §4.1)
  - [x] 2.7 Implement `services/roadmapService.ts` including derived `roadmap_unlocked` (all non-skipped `CourseSection`s done), reorder/defer mutations gated on that derived value, and `getSectionGroupProgress()` for the segmented bars (§6); implement `services/milestoneService.ts` for derived `isJobReady()` (§4.3) and the one-time `job_ready_notified` flag
  - [x] 2.8 Implement `services/dailyLogService.ts` (create log, enforce 10-min floor for "studied", same-day-only for "rest")
  - [x] 2.9 Implement `services/streakService.ts` and `services/restDayBudgetService.ts` (cap default 4/month, monthly rollover on the 1st)
  - [x] 2.10 Implement `services/quizService.ts` (store attempts, compute `flagged_for_review` from score threshold)

- [x] 3.0 Core screens & navigation
  - [x] 3.1 Set up `app/_layout.tsx` root layout (gated on `initDatabase()`) and tab navigation (Today, Course, Roadmap, Progress, Settings) via `app-tabs.tsx` + `app-tabs.web.tsx`
  - [x] 3.2 Build `app/index.tsx` (Today): today's log status, `DailyLogModal` trigger, streak summary via `StreakBadge`
  - [x] 3.3 Build `components/SectionCard.tsx`, `app/course/_layout.tsx` (nested Stack), `app/course/index.tsx`: Layer 1 section list with status; skim bulk-mark UI lives on the detail screen (3.7) since it needs per-section state
  - [x] 3.4 Build `components/RoadmapItemCard.tsx` and `app/roadmap.tsx`: Layer 2 list showing locked state while Layer 1 incomplete, reorder (move-up/move-down, not drag) + defer once unlocked, "add new item" form (collects `sectionGroup`), `isOngoing`/`floor` pills distinguishing item kinds
  - [x] 3.5 Build `components/DailyLogModal.tsx`: studied (section/item picker + duration), rest (with `RestDayIndicator`), disabled rest option once cap hit
  - [x] 3.6 Build `components/PathProgressMap.tsx`, `components/SegmentedProgressBars.tsx`, `components/JobReadyBadge.tsx`, and `app/progress.tsx`: route/waypoint visual + streak/hours stats + Layer 1 bar + per-`section_group` Layer 2 bars (not one global percentage) + persistent job-ready badge once `milestoneService.isJobReady()` is true
  - [x] 3.7 Build `app/course/[id].tsx`: section detail, status cycling, §4.1 skim bulk-mark UI (Section 1 only), entry point to `QuizPlayer` once done (built ahead of 6.3 since a dead "quiz" button would've shipped broken)
  - [x] 3.8 Build `app/settings.tsx`: notification window config (`notificationConfigService.ts`, new), rest-day cap (adjustable), other `NotificationConfig` fields

- [x] 4.0 Daily log & streak engine
  - [x] 4.1 `utils/streakLogic.ts` pure functions (built in 2.9, needed by `streakService`) — added `utils/streakLogic.test.ts` now (6 cases: fresh start, consecutive, longest-streak overtake, gap-restart, same-day idempotency, reset with/without a prior streak)
  - [x] 4.2 10-minute floor enforcement — already in `dailyLogService.createStudiedLog` (throws below floor, so no invalid log is ever persisted) and `DailyLogModal` (2.8/3.5); nothing further needed since a rejected log never reaches day-close
  - [x] 4.3 Same-day-only rest-day rule — already in `dailyLogService.createRestLog` (throws unless `date === todayLocalDate()`) and `DailyLogModal` has no date picker at all (2.8/3.5)
  - [x] 4.4 New `services/dayCloseService.ts` (`runDayCloseCheck`): on app open (wired into `_layout.tsx` right after `initDatabase()`), walks every calendar day strictly between `lastLoggedDate` and today, writes a `missed` `DailyLog` for each unlogged one, and calls `streakService.recordMissedDay()` once. Today itself is never marked missed — its window is still open until the real 11:59 PM deadline, which a local-only app can't observe directly
  - [x] 4.5 `RestDayBudget` cap enforcement — already in `restDayBudgetService` (`incrementUsedCount` throws at cap; each month is a fresh row via `getBudgetForMonth`, which *is* the rollover) and `DailyLogModal`/`RestDayIndicator` (2.9/3.5)
  - [x] 4.6 Streak-break message — `StreakBadge` (3.2) already renders the one-line message and dismisses via `acknowledgeStreakBreak()`; now actually triggers, since 4.4 is what sets `streakBrokenPendingAck`
  - [x] 4.7 Added `jest.mock('@/services/db')`-based `services/dailyLogService.test.ts` and a stateful-fake-db `services/restDayBudgetService.test.ts` (floor, same-day, cap, and rollover-isolation cases), plus `services/dayCloseService.test.ts` (not originally listed, added since day-close's date math is exactly the kind of thing that gets off-by-one bugs). Needed a `moduleNameMapper` for `@/*` in the Jest config and `@types/jest` + explicit `"types": ["jest"]` in `tsconfig.json` — TypeScript 6.0's `moduleResolution: "bundler"` doesn't auto-include ambient `@types` packages the way older resolution modes did

- [x] 5.0 Notifications & weekly review
  - [x] 5.1 `services/notificationService.ts`: `ensureNotificationSetup()` (permissions + Android channel via `setNotificationChannelAsync`/`AndroidImportance.HIGH`), plus `scheduleAt`/`scheduleNow`/`scheduleWeekly`/`cancelNotification` wrappers over the verified SDK 57 `expo-notifications` API (`SchedulableTriggerInputTypes.DATE`/`WEEKLY`, `trigger: null` for immediate)
  - [x] 5.2 `constants/copy.ts`: `DAILY_COPY` (open/nudge/softClose/hardDeadline), `WEEKLY_REVIEW_COPY`, `JOB_READY_COPY`, `streakBreakLine()` — also refactored `StreakBadge`/`JobReadyBadge` (built in 3.0) to import from here instead of duplicating the strings inline
  - [x] 5.3 `hooks/useNotificationScheduler.ts`: on `todayLog`/`config` change, cancels the 4 daily identifiers and — if reminders are enabled and today is still unlogged — reschedules only the ones whose time hasn't passed yet today (re-evaluated fresh each day the app is opened, since local triggers can't be conditionally skipped once fired)
  - [x] 5.4 `NotificationConfig` (`windowStart`/`windowEnd`/`hardDeadline`/`remindersEnabled`/`weeklyReviewEnabled`) flows Settings → `notificationConfigService` → `useNotificationConfig` → `useNotificationScheduler`
  - [x] 5.5 `components/NotificationEffects.tsx` (mounted in `_layout.tsx`) listens via `addNotificationResponseReceivedListener`; a tapped daily reminder routes to `/?openLog=1`, which `app/index.tsx` watches to auto-open `DailyLogModal`; weekly-review/job-ready taps route to `/progress`
  - [x] 5.6 `components/WeeklyReviewCard.tsx` + `hooks/useWeeklyReview.ts` (days logged, hours, what's next, flagged quiz sections via `quizService.getLatestFlaggedAttempts`), mounted on the Progress screen — no dedicated weekly-review route existed, and Progress is the "how am I doing" screen
  - [x] 5.7 Weekly review scheduled as a repeating `WEEKLY` trigger (Sunday 18:00, identifier `weekly-review`) inside `useNotificationScheduler`, re-scheduled only when `config` changes
  - [x] 5.8 Same hook checks `milestoneService.isJobReady()`/`hasJobReadyBeenNotified()` on every `todayLog` change and fires `scheduleNow` (immediate trigger) + `markJobReadyNotified()` exactly once

- [x] 6.0 Quizzes — Tier 1 static bank
  - [x] 6.1 Finalize `data/seed/quizQuestions.ts` content quality pass (5-8 questions/section, matches section's core concepts)
  - [x] 6.2 Implement quiz unlock condition: quiz becomes available once its `CourseSection.status === 'done'` (built into `app/course/[id].tsx`)
  - [x] 6.3 Build `components/QuizPlayer.tsx`: MCQ flow, submission, score calculation, explanation display (built during 3.7)
  - [x] 6.4 New `hooks/useFlaggedSections.ts` (wraps `quizService.getLatestFlaggedAttempts`) feeds a "worth a revisit" pill on `SectionCard` (Course list) and a matching note on the section detail screen, refreshed right after a quiz submit so a newly-flagged result shows immediately
  - [x] 6.5 Already done — `WeeklyReviewCard`/`useWeeklyReview` (built in 5.6) already pulls flagged sections with exactly this copy pattern
  - [x] 6.6 `services/quizService.test.ts`: parsed-options read-back, scoring + threshold flagging (pass and fail cases), attempt persistence, and latest-per-section flagged filtering (stateful fake db, same pattern as `restDayBudgetService.test.ts`)
