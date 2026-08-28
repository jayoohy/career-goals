# PRD: CV/Robotics Path — Accountability App

**Owner:** Joy
**Status:** Draft v3 — Layer 2 resequenced for a dual CV/Robotics track, job-ready threshold and segmented progress added (post-v2 build note, see §11 rows 10-12)
**One-line pitch:** A mobile app that tracks Joy's path from frontend engineer to computer vision/robotics engineer, holds the full course + beyond-course roadmap, and behaves like a supervisor who won't let a day slide silently.

---

## 1. Problem

Joy has a clear long-term goal (computer vision / robotics engineer, Tesla/NVIDIA-tier) and a real curriculum (Krish Naik CV course → fast.ai/CS231n → portfolio projects). The blocker isn't knowledge or resources, it's that self-directed evening study competes with rest after a full-time job, and nothing currently notices when a day is skipped. The fix isn't more content, it's an external structure that (a) holds the whole path in one place, not scattered across a course platform, notes, and memory, and (b) actively follows up like a person would, instead of passively waiting to be opened.

## 2. Goals

- Give Joy one place that holds the entire journey: course content + everything after it, in order.
- Force a daily decision point: did today's session happen or not — no silent skipping.
- Escalate like an actual accountability partner would: a nudge, then a harder nudge, not just one polite notification.
- Make progress visible enough that skipping feels like breaking a visible streak, not an abstract lapse.

**Explicitly not a goal:** teaching content itself. This app tracks and enforces; it doesn't replace the course, YouTube, or fast.ai.

## 3. User

Single user (Joy). No multi-user, no social features, no accounts system needed beyond local auth. Build for one person, not a product.

## 4. Core concept: three layers of content

### Layer 1 — The course (Krish Naik CV course, in order)
All sections tracked individually so nothing gets marked "done" by accident.

| # | Section | Videos | Duration | Notes |
|---|---|---|---|---|
| 1 | Python Prerequisites | 43 | 11h52m | Skim-flagged — see §4.1 |
| 2 | Introduction to Deep Learning | 2 | 21m | |
| 3 | DL — ANN, Optimizers, Loss, Activation, CNN Theory | 37 | 6h23m | Flag: pause for 3Blue1Brown if backprop doesn't land |
| 4 | Computer Vision (OpenCV with Python) | 20 | 9h41m | |
| 5 | PyTorch | 24 | 10h34m | Core section — primary framework, go slow |
| 6 | Deep Dive Visualizing CNNs | 8 | 2h03m | |
| 7 | Image Classification | 20 | 3h57m | |
| 8 | Data Augmentation | 3 | 30m | Quick win, good for low-energy days |
| 9 | Basics of Object Detection | 12 | 3h47m | |
| 10 | Image Segmentation | 10 | 4h55m | |
| 11 | Project 001 — YOLO Powered Image Search App | 9 | 5h28m | Ship this even if rushed |

Total: ~59h30m raw. TensorFlow-specific lessons inside mixed sections are marked **skip** — PyTorch only, per Joy's existing direction.

**§4.1 — Skim logic:** Section 1 (Python Prerequisites) should not be tracked as 43 equal units. The app should let Joy bulk-mark "already know this" on sub-groups (e.g. basic syntax, loops, functions) in one tap rather than opening and closing 40 videos she doesn't need.

### Layer 2 — Beyond the course (the actual goal-path)
This is the part that doesn't exist yet anywhere and is the app's real value. Joy is targeting both **CV Engineer** and **Robotics SWE** roles — overlapping but not identical — so this roadmap covers both tracks rather than a CV-only path. After Layer 1, the app should surface a pre-loaded, ordered roadmap:

1. **fast.ai — Practical Deep Learning for Coders** (free, video-first, project-based) — fills gaps the Udemy course moves past quickly.
2. **C++ fundamentals + ROS basics + sensor fusion fundamentals** — runs in parallel with item 3, not after it. ROS is mostly a tooling/integration layer built substantially in C++, not deep theory, and doesn't need to wait behind CS231n-level math — it only needs *some* working CV to have something worth feeding into a robot. C++ is learned in this slot specifically through ROS usage (nodes, message passing, CMake/colcon), not as a standalone language detour.
3. **First portfolio project — CV+robotics** — the 3DOF robotic arm revisit with a CV component. Built using ROS + fast.ai output from items 1-2, not built first and integrated later. Shipping a rough v1 counts.
4. **Simulation** — Gazebo or PyBullet as the base (Isaac Sim as a later stretch if Joy goes further into robotics specifically). Where a ROS + CV pipeline gets tested end-to-end before touching real hardware.
5. **CS231n lecture series** (YouTube, free) — reference depth, pull in per-topic rather than linearly.
6. **Andrew Ng's Deep Learning Specialization** (Coursera, optional, financial-aid eligible) — deeper math grounding once momentum exists.
7. **SLAM fundamentals** — Simultaneous Localization and Mapping. Core robotics perception, shows up in most Robotics SWE interview loops. Pairs with the sensor-fusion work in item 2.
8. **3D vision / point clouds** — stereo vision, camera calibration, Open3D or PCL basics. Most "CV Engineer" roles today are really 3D perception roles past the classification/detection stage — commonly skipped by self-taught CV learners.
9. **Model deployment / edge optimization** — ONNX, TensorRT, quantization. Formalizes and extends existing experience (TF Lite, Raspberry Pi, the tomato-sorting project) rather than learning from scratch — a real differentiator. **Tagged as ongoing**, not a single linear slot: it threads through multiple portfolio projects rather than completing once.
10. **Other portfolio project candidates** — Multi-Agent Control Room, Agent Trace Debugger, a computer-vision extension of the tomato sorting machine project. Still valid, sequenced after the primary CV+robotics project rather than competing with it for the first slot.
11. **DSA / interview prep** — robotics/CV SWE interviews still lean on general DSA at most companies, separate from the ML-specific interview loop. Runs alongside career transition milestones, not before them.
12. **Career transition milestones** — update portfolio site, tailor CV/LinkedIn toward CV/robotics roles, identify and shortlist target companies/roles, first applications. Makes the most sense once the job-ready marker (§4.3) has flipped true.

Each Layer 2 item should have: a short description, an estimated time investment, and a suggested position in the sequence. The app should not hard-block Layer 2 behind 100% Layer 1 completion; some items (e.g. starting a portfolio project) can run in parallel once core CNN/PyTorch sections are done.

**Explicitly not added yet (deliberate):** open-source contributions, Kaggle competitions, research paper reading/writing. These are longer-term additive polish, not core path — adding them now risks recreating the "too much, unsequenced" problem this app exists to solve. Revisit only after Layer 1 + the first robotics portfolio project are done.

**§4.2 — Reordering rule (decision):** unchanged by the resequencing above — Layer 2 sequence is **locked while Layer 1 is incomplete**, and **unlocks for reordering/deferring once Layer 1 is done**. The list above is a new default order, not a change to this rule.

Rationale: fully freeform reordering reintroduces the "what should I do today" decision this app exists to remove, and makes it easy to dodge a boring-but-necessary section by calling it reprioritisation. Fully fixed is brittle if a portfolio idea changes. The hybrid means reordering only becomes available at the point where Joy has enough context to make that call well.

Implementation: `RoadmapItem.sequence_position` is read-only in the UI until all non-skipped `CourseSection` records are `done` or `skipped`; after that, drag-to-reorder and a per-item "defer" action become available. Adding a *new* Layer 2 item (e.g. a portfolio project idea that didn't exist at setup) should be allowed at any time — it appends to the end of the sequence rather than inserting mid-list.

**§4.3 — Job-ready threshold (decision):** with 12 Layer 2 items now spanning two tracks, the honest full list can read as "not ready until all of this is done" — overwhelming, and untrue. Most CV/Robotics SWE roles need enough, not everything. `RoadmapItem.job_ready_threshold` (bool) marks the specific items that form the actual floor for applying, not the ceiling for mastery:

- Layer 1 course complete
- fast.ai complete
- C++ + ROS + sensor fusion basics complete
- First CV+robotics portfolio project shipped (v1/rough is fine)
- Simulation basics touched (doesn't need to be deep)

Everything past that floor — CS231n depth, Andrew Ng, SLAM, 3D vision, deployment optimization, DSA polish — is **strengthening, not gating**: genuinely useful, genuinely fine to keep learning *while* applying, not a prerequisite to the first application.

When every floor item is done, the app triggers a one-time notification distinct from the daily nudges and weekly review (e.g. "The floor's covered. You could start applying now. Everything left on the roadmap makes you stronger, not more hireable-vs-not.") and then shows a **persistent** badge on the path-progress view (§6) — a standing marker, not a toast that can be missed or forgotten. Career transition milestones are tied to this trigger: they make more sense once job-ready has flipped true, not before.

### Layer 3 — Daily log
The actual behavioral unit. Each day, Joy marks one of:
- **Studied** (auto-prompts: which section/item, how long)
- **Rest day** (explicitly chosen, doesn't break streak logic — see §6)
- **Missed** (only recorded if neither of the above happens by the deadline — see §5)

## 5. Notification & escalation logic (the "supervisor" behavior)

| Time | Trigger | Behavior |
|---|---|---|
| 7:00 PM | Daily reminder window opens | Notification: "Study window's open. 30 min, same as always." |
| 7:00–8:00 PM | Reminder window | If unopened by 7:45, a second lighter nudge. Tone: direct, not guilt-based. |
| 8:00 PM | Window soft-close | If nothing logged, one notification acknowledging it's later than planned, not punitive — "Didn't get to it yet? Still time before 10." |
| 10:00 PM | Hard deadline | If still nothing logged: escalated notification. This is the "supervisor" moment — plainer, more direct language ("Today's not logged. Streak breaks at midnight if this stays empty.") Not aggressive, but not soft either. |
| 11:59 PM | Day closes | If still nothing logged and it wasn't marked as a rest day, day is recorded as missed, streak resets. |

**Decision (v1): standard scheduled push notifications**, not alarm-strength. Simpler to build (`expo-notifications` covers this directly, no special OS entitlements needed), and can be revisited later if push alone isn't cutting through.

**Rest days:** Joy marks a rest day **same-day only** — no pre-marking ahead of time. This requires an explicit action (not a default), so rest is a decision made on the day it applies to, not a lapse absorbed silently or a slot banked in advance. (Pre-marking was considered and dropped: marking all 4 rest days on the 1st of the month technically obeys the cap while defeating its purpose — same-day-only closes that off structurally rather than relying on Joy not to do it.)

**Rest day cap:** Max **4 rest days per calendar month** (default, adjustable in settings). Once the cap is hit, the "mark as rest day" option is disabled for the rest of the month — any further unlogged day is recorded as missed. The app should show remaining rest days somewhere visible (e.g. "2 of 4 rest days left this month") so Joy isn't surprised when the option disappears.

**Missed day = full streak reset.** No soft decay. A missed day resets `current_streak` to 0. This was a deliberate choice over gradual decay — full reset keeps the daily log meaningfully high-stakes.

## 6. Streaks & progress visibility

- Current streak (consecutive studied/rest-marked days), longest streak, total hours logged.
- **Segmented progress, not one global bar (decision, post-v2):** a single bar that only hits 100% at full mastery of every roadmap item — including strengthening-tier items past the job-ready floor (§4.3) — undersells real progress and fights against the job-ready marker; it would keep reading as "not done yet" even after Joy is job-ready and applying. Instead:
  - **Layer 1 — Course** — its own bar, 0-100% across the 11 sections.
  - **Layer 2**, broken into its own sub-bars rather than one combined bar, grouped by `RoadmapItem.section_group`:
    - *Core skills* (fast.ai, CS231n, Andrew Ng)
    - *Robotics track* (C++, ROS, sensor fusion, SLAM, 3D vision, simulation)
    - *Portfolio* (each project tracked individually, plus a combined bar)
    - *Deployment/edge* (tagged `ongoing` — tracked separately since it threads through multiple projects rather than completing once)
    - *Career transition* (portfolio site, CV/LinkedIn, shortlist, applications)
  - No single number represents "how done Joy is" overall — each group reaching 100% should feel like a complete win on its own, independent of what's left elsewhere.
- The **job-ready badge (§4.3)** is a separate, persistent marker on this view — a threshold flag, not a percentage, and not folded into any of the bars above.
- A "path progress" visual showing distance from "frontend developer" to "CV/robotics engineer" — this is the emotional anchor of the app, so it should feel earned, not decorative. Consider a route/map metaphor (waypoints along a path) rather than a generic percentage bar, since the whole point is showing *movement toward a specific identity*, not just task completion. This visual sits alongside the segmented bars above, not as a replacement for them.

### 6.1 Studied-day floor and streak-break messaging

**10-minute floor.** A day can only be logged as "Studied" if duration ≥ 10 minutes. Below that, the day-close logic (§5, 11:59 PM) treats it the same as an unlogged day: missed, unless explicitly marked rest. This keeps the streak meaning something without setting the bar so high that a genuinely short, exhausted-evening session gets punished out of existence — 10 minutes is enough to open the material and do *something*, not enough to game.

**Streak-break message.** When `current_streak` resets to 0, the next time Joy opens the app she sees one neutral line, not a notification burst and not silence. Pattern: state the fact, state the longest streak, stop.
- "Streak's back to 0. Longest was 23."
- Not: "You broke your streak! 😢 Don't give up!"
- Not: nothing at all (a silent reset undercuts the whole point of §6 — that skipping should feel like breaking something visible).

## 7. "Accountability partner" tone

Notification and in-app copy should read like a person who's invested but not soft — direct, specific, no corporate-app cheeriness ("You've got this! 🎉"), no shame either. Examples:
- Good: "Section 6 has been sitting at 40% for 9 days. Still the plan, or did priorities shift?"
- Avoid: "Don't give up on your dreams!"
- Avoid: "You failed to log today." (factual but punitive — prefer "Today's empty.")

Weekly, not daily: a short review surfaced once a week (e.g. Sunday evening) — days logged, hours total, what's next — rather than only reactive daily nudges. This is the "supervisor" layer: a weekly check-in, not just a daily alarm.

## 7.1 Challenges & quizzes

Two implementation tiers — start with the first, no API required:

**Tier 1 — Static question bank (v1, recommended start).**
Each `CourseSection` has a pre-written set of 5-8 multiple-choice questions covering its core concepts (e.g. Section 3: what backprop actually computes, what a loss function does, gradient descent intuition). Questions are authored once, stored locally, no runtime API dependency, works offline, zero ongoing cost. A quiz unlocks when a section is marked done, functioning as a light "did this actually land" checkpoint rather than a hard gate.

**Quiz results (decision): purely informational, non-gating — but a low score triggers a nudge to revisit, not just a silent score.** A low score (e.g. below ~60%) doesn't block progress or force a retake, but surfaces a specific "worth another look" flag on that section — visible on the section itself and pulled into the weekly review (§7) alongside the copy pattern already established there, e.g. "Section 3 quiz: 2/6. Worth a second pass before moving on?" This gives the weekly review something concrete to reference without turning the quiz into a gate Joy has to clear.

*Build tip:* Claude (or any LLM) can be used once, during development, to help draft the question bank per section — that gets AI-quality questions without any live API call inside the shipped app.

**Tier 2 — Dynamic generation (later, optional).**
Uses the Claude API at runtime to generate new questions per topic, or to quiz on Joy's own project code/notes rather than fixed content. More flexible, supports infinite variation, but adds an API cost and a network dependency to something meant to work reliably every evening. Worth revisiting only if the static bank starts feeling stale or repetitive.

**Challenges (Layer 2 projects):** rather than quizzes, portfolio/project items (Multi-Agent Control Room, tomato-sorting CV extension, etc.) get a simple checklist of sub-milestones instead of MCQs — e.g. "load a pretrained model," "run inference on 5 test images," "write up findings" — since project work isn't well captured by multiple choice.

## 8. Data model (high level)

- `CourseSection` — id, title, video_count, duration, status (not_started/in_progress/done/skipped), skim_flag
- `RoadmapItem` (Layer 2) — id, title, source (fast.ai/CS231n/Coursera/project/career/reference), section_group (course/core_skills/robotics_track/portfolio/deployment/career — drives the segmented progress bars in §6), description, estimated_hours, sequence_position, status, is_ongoing (bool — true for items like deployment/edge optimization that thread through multiple projects rather than completing once), job_ready_threshold (bool — marks the floor items for the job-ready marker in §4.3), user_added (bool — distinguishes pre-loaded items from ones Joy adds later)
- `DailyLog` — date, type (studied/rest/missed), linked_item_id (optional), duration, notes
- `StreakState` — current_streak, longest_streak, last_logged_date
- `RestDayBudget` — month (YYYY-MM), cap (default 4), used_count — derived from `DailyLog` but cached for fast "2 of 4 left" display; resets on the 1st
- `QuizQuestion` — id, section_id, prompt, options[], correct_index, explanation (static bank, seeded at build time)
- `QuizAttempt` — id, section_id, date, score, answers[], flagged_for_review (bool — derived from score < threshold, surfaced in weekly review)
- `NotificationConfig` — window_start (default 19:00), window_end (default 20:00), hard_deadline (default 22:00), enabled flags
- `MilestoneState` — singleton, job_ready_notified (bool) — tracks whether the one-time job-ready notification (§4.3) has already fired. The job-ready state itself is derived, not stored (see below); this only remembers whether the user has already been told.

`roadmap_unlocked` is **derived, not stored** — computed as "all non-skipped CourseSections are done" so it can't drift out of sync with actual progress. `job_ready` (§4.3) is derived the same way — computed from CourseSection completion plus every `job_ready_threshold` `RoadmapItem` being done.

## 9. Technical notes (for build)

- Given Joy's stack (React/Next.js/TypeScript), **React Native (Expo)** is the fastest path to a working mobile app without learning a new ecosystem.
- Local notifications: **decided — standard scheduled push via `expo-notifications`, no alarm-strength escalation in v1.** This keeps the app inside managed Expo with no special entitlements.
  - Context for any future revisit: true alarm-style behavior that survives Do Not Disturb and can't be casually swiped is limited on iOS by Apple's Critical Alerts entitlement (special approval, realistically unobtainable for a personal app). On Android it's achievable via `AlarmManager`-equivalent scheduling — a bare workflow or `notifee` with full-screen intent. So alarm-strength would mean an Android-only capability plus an ejected build. Not worth it until push alone is demonstrably failing.
  - Practical mitigation in the meantime: keep the 22:00 escalation notification visually and textually distinct from the earlier nudges, so it doesn't get pattern-matched into background noise.
- Persistence: local-first (SQLite via `expo-sqlite` or `WatermelonDB`) is enough — no backend needed for a single-user app, which keeps this buildable solo.
- No auth/backend needed for v1. Cloud sync only becomes relevant if Joy wants multi-device access.

## 10. Out of scope (v1)

- Multi-user / sharing / social accountability features
- Video playback inside the app (the app tracks progress, it doesn't host or stream course content)
- AI-generated coaching messages (start with a fixed set of well-written copy variants per notification type; revisit dynamic messaging later if the fixed set feels stale)

## 11. Resolved decisions

| # | Question | Decision |
|---|---|---|
| 1 | Alarm-strength vs. standard push | **Standard scheduled push** (`expo-notifications`). Revisit only if push is demonstrably being ignored. See §9. |
| 2 | Streak reset vs. soft decay | **Full reset to 0**, plus a **4-per-month rest-day cap** so real bad days have a legitimate outlet. See §5. |
| 3 | Layer 2 editable vs. fixed | **Hybrid** — locked while Layer 1 is in progress, unlocks for reorder/defer once Layer 1 is complete. See §4.2. |
| 4 | Quizzes — API needed? | **No, not for v1.** Static authored question bank, seeded at build time. Dynamic Claude API generation is a Tier 2 option only. See §7.1. |
| 5 | Minimum bar for a "studied" day | **10-minute floor.** Below 10 minutes logged, the day can't be marked studied. See §6.1. |
| 6 | Rest-day pre-marking | **Same-day only, no pre-marking.** Removes the "front-load all 4 on the 1st" loophole entirely. See §5. |
| 7 | Do quiz results do anything? | **Purely informational, but a low score triggers a "revisit this" nudge.** Non-gating — doesn't block progress, just flags it. See §7.1. |
| 8 | Streak-break handling | **One neutral line**, no punitive framing, no silence either. See §6.1. |
| 9 | Weekly review timing | **Sunday evening, as originally proposed in §7.** Confirmed. |
| 10 | C++ in scope for the roadmap? | **Yes.** Joy is targeting both CV Engineer and Robotics SWE roles, including C++-required ones. Added as a combined "C++ fundamentals + ROS basics + sensor fusion" item, scoped through ROS usage (nodes, message passing, build tooling) rather than general language study. See §4. |
| 11 | Single global progress bar or segmented? | **Segmented, grouped by `RoadmapItem.section_group`.** A single bar undersells real progress once "job-ready" no longer means "100% of everything." See §6. |
| 12 | Signal when Joy is ready to start applying? | **Yes — a `job_ready_threshold` flag on specific floor items, a one-time distinct notification when they're all done, and a persistent badge afterward.** See §4.3. |

All open questions resolved — ready to move from PRD to build. (Layer 2 content, job-ready threshold, and segmented progress added post-v2 via build note; see rows 10-12 above and §4-§6.)
