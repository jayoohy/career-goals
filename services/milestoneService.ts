import { isLayer1Complete } from '@/services/courseSectionService';
import { db } from '@/services/db';
import { getAllRoadmapItems } from '@/services/roadmapService';

/**
 * Derived — never stored (PRD §4.3/§8): true once Layer 1 is complete and every
 * `job_ready_threshold` RoadmapItem is done. This is the floor for applying, not the ceiling
 * for mastery — strengthening items past the floor don't affect it.
 */
export async function isJobReady(): Promise<boolean> {
  const [layer1Done, roadmapItems] = await Promise.all([isLayer1Complete(), getAllRoadmapItems()]);
  if (!layer1Done) {
    return false;
  }
  const floorItems = roadmapItems.filter((item) => item.jobReadyThreshold);
  return floorItems.length > 0 && floorItems.every((item) => item.status === 'done');
}

export async function hasJobReadyBeenNotified(): Promise<boolean> {
  const row = await db.milestoneState.get(1);
  return row?.jobReadyNotified ?? false;
}

/** Call once the one-time job-ready notification (§4.3) has been sent, so it never fires twice. */
export async function markJobReadyNotified(): Promise<void> {
  await db.milestoneState.update(1, { jobReadyNotified: true });
}
