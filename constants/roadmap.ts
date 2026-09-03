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
