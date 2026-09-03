import type { RoadmapSectionGroup } from '@/types/models';

/** Human labels for `RoadmapItem.sectionGroup` — one source of truth for every roadmap surface. */
export const ROADMAP_GROUP_LABEL: Record<RoadmapSectionGroup, string> = {
  course: 'Course',
  core_skills: 'Core skills',
  robotics_track: 'Robotics track',
  portfolio: 'Portfolio',
  deployment: 'Deployment',
  career: 'Career',
};

/**
 * Built-in roadmap items whose plan explicitly says they run *alongside* other work rather than
 * waiting their turn in the sequence — so they stay loggable even when they aren't the current
 * step. The course is still strictly one-at-a-time; this only applies once Layer 2 is unlocked.
 * User-added items are never parallel.
 */
export const PARALLEL_ROADMAP_ITEM_IDS = new Set<string>([
  'cpp-fundamentals-ros-sensor-fusion', // "Runs in parallel with the first portfolio project"
  'cs231n-lecture-series', // "pull in per-topic rather than linearly"
  'model-deployment-edge-optimization', // ongoing — "threads through multiple portfolio projects"
  'dsa-interview-prep', // "Runs alongside career transition milestones"
]);
