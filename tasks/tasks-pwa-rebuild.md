## Relevant Files

- `package.json` - Renamed to `career-goals`, Next.js scripts replace Expo scripts.
- `vercel.json` - Cron job schedules for the five push-notification triggers.
- `app/layout.tsx` - Root layout: nav shell, theme, service worker registration.
- `app/page.tsx` - Today/home page (daily log entry + in-app supervisor banner).
- `app/course/page.tsx`, `app/course/[id]/page.tsx` - Course list and section detail pages.
- `app/roadmap/page.tsx` - Layer 2 roadmap page.
- `app/progress/page.tsx` - Segmented progress bars, path map, job-ready badge.
- `app/settings/page.tsx` - Notification/rest-day settings.
- `app/weekly-review/page.tsx` - Weekly review screen.
- `app/api/subscribe/route.ts` - Stores/updates the push subscription in Redis.
- `app/api/log-sync/route.ts` - Stores today's `{date, logged}` flag in Redis.
- `app/api/cron/window-open/route.ts`, `app/api/cron/window-nudge/route.ts`, `app/api/cron/soft-close/route.ts`, `app/api/cron/hard-deadline/route.ts`, `app/api/cron/weekly-review/route.ts` - The five scheduled push senders.
- `components/DailyLogModal.tsx`, `components/JobReadyBadge.tsx`, `components/PathProgressMap.tsx`, `components/QuizPlayer.tsx`, `components/RestDayIndicator.tsx`, `components/RoadmapItemCard.tsx`, `components/SectionCard.tsx`, `components/SegmentedProgressBars.tsx`, `components/StreakBadge.tsx`, `components/WeeklyReviewCard.tsx`, `components/NavTabs.tsx` - Ported/rebuilt UI components.
- `hooks/useCourseSections.ts`, `hooks/useDailyLog.ts`, `hooks/useFlaggedSections.ts`, `hooks/useMilestone.ts`, `hooks/useQuiz.ts`, `hooks/useRoadmap.ts`, `hooks/useStreak.ts`, `hooks/useWeeklyReview.ts`, `hooks/usePushSubscription.ts` - Ported/new hooks.
- `services/db.ts` - Dexie (IndexedDB) schema, replacing `expo-sqlite`.
- `services/courseSectionService.ts`, `services/roadmapService.ts`, `services/dailyLogService.ts` (+`.test.ts`), `services/streakService.ts`, `services/quizService.ts` (+`.test.ts`), `services/restDayBudgetService.ts` (+`.test.ts`), `services/milestoneService.ts` (+`.test.ts`), `services/dayCloseService.ts` (+`.test.ts`), `services/notificationConfigService.ts` - Ported services.
- `services/logSyncService.ts` - Client-side sync of the daily-log flag to `/api/log-sync`.
- `server/push.ts` - `web-push` send helper, VAPID config, 410-handling.
- `server/redis.ts` - Upstash Redis client.
- `server/auth.ts` - Shared-secret token validation for the two write routes.
- `data/seed/courseSections.ts`, `data/seed/quizQuestions.ts`, `data/seed/roadmapItems.ts` - Carried over unchanged.
- `types/models.ts` - Carried over, extended with `PushSubscriptionRecord` and `DayLogSyncFlag`.
- `utils/dateUtils.ts`, `utils/id.ts`, `utils/streakLogic.ts` (+`.test.ts`) - Carried over unchanged.
- `public/manifest.json` - PWA manifest.
- `public/sw.js` - Service worker: offline caching + push/notificationclick listeners.
- `public/icons/*` - New icon set at required PWA sizes.

### Notes

- Unit tests are placed alongside the files they test (e.g. `dailyLogService.ts` and `dailyLogService.test.ts` in the same directory).
- Run tests with `npx jest [optional/path]`; no path runs the full suite.
- This task list implements [prd-pwa-rebuild.md](prd-pwa-rebuild.md).

## Tasks

- [x] 0.0 Create feature branch
  - [x] 0.1 Create and checkout a new branch for this work (e.g. `git checkout -b feature/pwa-rebuild`)
- [x] 1.0 Scaffold the Next.js PWA project (replacing the Expo app)
  - [x] 1.1 Initialize a Next.js (App Router, TypeScript) project structure in the repo
  - [x] 1.2 Configure styling (Tailwind or equivalent) matching the existing tokens in `constants/theme.ts`
  - [x] 1.3 Set up ESLint/Prettier consistent with the existing `.prettierrc.json` and `eslint.config.js` conventions
  - [x] 1.4 Set up Jest for the new stack, carrying over the existing test config pattern from `package.json`
  - [x] 1.5 Set up the folder skeleton: `/app`, `/components`, `/hooks`, `/services`, `/server`, `/data/seed`, `/constants`, `/types`, `/utils`, per the code-separation rule (old Expo source moved to `legacy-expo-src/` for reference during porting, removed in task 6)
  - [x] 1.6 Rename `package.json` to `career-goals` and update scripts for Next.js (dev/build/start/lint/test)
- [x] 2.0 Port data layer: seed data, local persistence (Dexie/IndexedDB), and pure business logic/services
  - [x] 2.1 Copy seed data files (`courseSections.ts`, `quizQuestions.ts`, `roadmapItems.ts`) into the new `data/seed` unchanged
  - [x] 2.2 Copy `types/models.ts`, extending it with `PushSubscriptionRecord` and `DayLogSyncFlag`
  - [x] 2.3 Copy pure-logic utils (`dateUtils.ts`, `id.ts`, `streakLogic.ts`) and their tests unchanged
  - [x] 2.4 Set up the Dexie database schema (`services/db.ts`) mirroring the existing `expo-sqlite` tables
  - [x] 2.5 Port `courseSectionService`, `roadmapService`, `dailyLogService`, `streakService`, `quizService`, `restDayBudgetService`, `milestoneService`, `dayCloseService`, `notificationConfigService` to Dexie, preserving logic and their `.test.ts` files
  - [x] 2.6 Run the ported test suite and confirm everything passes on the new stack (31/31 passing, using `fake-indexeddb` for a real Dexie backend in Jest instead of hand-rolled SQL mocks)
- [x] 3.0 Build UI: components, hooks, and pages for course tracking, roadmap, daily log, streaks, segmented progress, and quizzes
  - [x] 3.1 Port theming to web equivalents — Tailwind CSS-variable tokens (`app/globals.css`) drive everyday styling; `use-color-scheme`/`use-theme` kept as a thin hook for raw-color cases (e.g. future SVG). `themed-text`/`themed-view` intentionally not ported — they wrapped RN's `Text`/`View`, which don't exist on the web; Tailwind classes on plain elements are the direct web equivalent.
  - [x] 3.2 Build the nav layout (replacing `app-tabs`) — `components/NavTabs.tsx`, wired into `app/layout.tsx`
  - [x] 3.3 Port `SectionCard`, `RoadmapItemCard`, `SegmentedProgressBars`, `PathProgressMap`, `JobReadyBadge`, `WeeklyReviewCard`, `QuizPlayer` to React/web (`StreakBadge`, `RestDayIndicator`, `DailyLogModal` done earlier)
  - [x] 3.4 Port remaining hooks (`useFlaggedSections`, `useMilestone`, `useQuiz`, `useWeeklyReview`, `useNotificationConfig`) — all copied verbatim, zero RN dependency existed in any hook
  - [x] 3.5 Build the Course list/detail, Roadmap, Progress, and Settings pages (Today page done earlier). Weekly review has no separate route — matching the original app, it's a card embedded in the Progress page, not a standalone screen.
  - [x] 3.6 Wire up the Section 1 skim-bulk-mark flow (§4.1) and the Layer 2 lock/unlock + defer/reorder behavior (§4.2) — both in `app/course/[id]/page.tsx` and `app/roadmap/page.tsx`
  - [x] 3.7 Wire up the rest-day cap/remaining display and the 10-minute studied-day floor validation (done as part of the Today page slice — `DailyLogModal` + `dailyLogService`)
  - [x] 3.8 Wire up the quiz flow: launch on section completion, score against the 60% threshold, flag for review, surface in the weekly review — `app/course/[id]/page.tsx` + `QuizPlayer` + `WeeklyReviewCard`
  - [x] 3.9 Build the in-app "supervisor" fallback banner for an unlogged day (req. 24)

  All 6 routes (`/`, `/course`, `/course/[id]`, `/roadmap`, `/progress`, `/settings`) build and lint clean; full test suite still 31/31.

  **Follow-up fix (caught during the task 7 requirements walkthrough):** the original app's `useNotificationScheduler` fired the one-time job-ready milestone notification (requirement 8) client-side, since `isJobReady()` depends on roadmap data that only exists in the client's IndexedDB. That trigger wasn't ported when `useNotificationScheduler` was correctly retired (task 6) as superseded by the server push architecture — added back as `components/JobReadyNotifier.tsx`, mounted at the app root, firing a local notification via the service worker (not a server push) and marking it notified. The persistent `JobReadyBadge` was already correct and unaffected.
- [x] 4.0 Implement PWA installability: manifest, icons, service worker, offline support
  - [x] 4.1 Placeholder icon wired via `app/icon.tsx` / `app/apple-icon.tsx` / `app/api/icon/route.tsx` (generated at build time, all required sizes) — clearly marked as a temporary swap-out for when Joy sources a real icon (resolved open question)
  - [x] 4.2 Add the web app manifest — `app/manifest.ts` (Next's file convention; served at `/manifest.webmanifest`, auto-linked)
  - [x] 4.3 iOS-specific meta tags — `appleWebApp` block in `app/layout.tsx` metadata + `app/apple-icon.tsx`
  - [x] 4.4 Service worker app-shell offline caching — `public/sw.js` (runtime cache-as-you-go, no build-time precache list — see file's own doc comment for why)
  - [x] 4.5 Service worker `push`/`notificationclick` listeners — `public/sw.js`, kept in its own clearly-labeled section separate from the caching logic
  - [ ] 4.6 Manually verify "Add to Home Screen" install and offline load (airplane mode) on Joy's iPhone — needs a live deployment (task 7); manifest/icon/SW verified locally via `next build` + `next start` in the meantime
- [ ] 5.0 Implement zero-cost push notification backend: VAPID, Upstash storage, subscribe/log-sync API routes, Vercel Cron schedules
  - [x] 5.1 Generated the VAPID key pair (`npx web-push generate-vapid-keys`) — stored in `.env.local` (gitignored); `.env.example` documents every var needed
  - [ ] 5.2 Set up an Upstash Redis instance (free tier) via the Vercel Marketplace integration — **needs Joy's Vercel/Upstash account, see task 7**; code is written against `UPSTASH_REDIS_REST_URL`/`_TOKEN` and degrades to a logged (non-fatal) error until they're set
  - [x] 5.3 Client-side subscribe flow — `services/pushSubscriptionService.ts` + `hooks/usePushSubscription.ts`, surfaced as an "Enable notifications" control on the Settings page, gated on `isRunningAsInstalledApp()`
  - [x] 5.4 `/api/subscribe` — validates the shared secret, upserts the subscription in Redis
  - [x] 5.5 Client-side log-sync — `services/logSyncService.ts`, called from `useDailyLog`'s `markStudied`/`markRest`
  - [x] 5.6 `/api/log-sync` — validates the shared secret, upserts today's logged flag in Redis
  - [x] 5.7 Shared send-notification helper — `server/push.ts` (`web-push` + VAPID), clears the stored subscription on a 410 response
  - [x] 5.8 Four daily cron routes — `app/api/cron/{window-open,window-nudge,soft-close,hard-deadline}/route.ts`, Lagos-time-to-fixed-UTC converted in `vercel.json`, gated on `server/dayLogFlag.ts`'s `isLoggedToday()` (computed via `server/lagosDate.ts`, not the server's own runtime timezone)
  - [x] 5.9 Sunday-evening weekly-review cron route — `app/api/cron/weekly-review/route.ts`, always sends (not gated on log status)
  - [x] 5.10 `vercel.json` — all five schedules (`0 18 * * *`, `45 18 * * *`, `0 19 * * *`, `0 21 * * *`, `30 19 * * 0` — UTC equivalents of 19:00/19:45/20:00/22:00 daily + Sunday 20:30 Lagos time)
  - [ ] 5.11 Manually verify end-to-end on a locked iPhone — **blocked on 5.2 and task 7's live deployment**

  Build/lint/tests all still clean with the full backend in place (`next build` succeeds; Upstash logs a non-fatal warning locally until real credentials exist, exactly as expected pre-task-7).
- [x] 6.0 Retire the old Expo/React Native codebase and finalize rename (career-goals)
  - [x] 6.1 Removed `app.json`, `eas.json`, and `scripts/reset-project.js` (`expo-*` packages were already gone from `package.json` since the task-1 scaffold replaced it wholesale)
  - [x] 6.2 Removed `legacy-expo-src/` entirely (it held the renamed `src/`, kept only as porting reference through tasks 2–5) and the unused `assets/` (Expo template icons/logos, superseded by the generated placeholder icons)
  - [x] 6.3 Rewrote `README.md` for the PWA stack; replaced `AGENTS.md`'s stale Expo-version note with a stack summary; `CLAUDE.md` unchanged (still correctly points at `@AGENTS.md`)
  - [x] 6.4 Verified via repo-wide grep: no real Expo/React Native imports remain anywhere in the codebase (only doc-comments referencing what was replaced, e.g. `NavTabs.tsx`'s "web equivalent of..." note); cleaned the now-irrelevant Expo/Metro/native sections out of `.gitignore`

  Build/lint/tests re-verified clean after the cleanup (31/31 tests, all 19 routes build).
- [ ] 7.0 Deploy to Vercel and verify end-to-end (install, offline, push) on Joy's iPhone
  - [ ] 7.1 Connect the repo to a Vercel project; configure environment variables (VAPID private key, Upstash credentials, shared-secret token)
  - [ ] 7.2 Deploy to production and confirm the build succeeds
  - [ ] 7.3 Install to the iPhone home screen from the live URL and verify standalone display mode
  - [ ] 7.4 Verify offline functionality (airplane mode) against the live deployment
  - [ ] 7.5 Verify push notifications end-to-end against the live deployment (not just localhost)
  - [ ] 7.6 Walk through every functional requirement in PRD §4 as a final acceptance pass
