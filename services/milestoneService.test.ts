import { db } from '@/services/db';
import type { RoadmapItem, RoadmapItemStatus } from '@/types/models';

const mockIsLayer1Complete = jest.fn();
const mockGetAllRoadmapItems = jest.fn();

jest.mock('@/services/courseSectionService', () => ({
  isLayer1Complete: (...args: unknown[]) => mockIsLayer1Complete(...args),
}));

jest.mock('@/services/roadmapService', () => ({
  getAllRoadmapItems: (...args: unknown[]) => mockGetAllRoadmapItems(...args),
}));

import { hasJobReadyBeenNotified, isJobReady, markJobReadyNotified } from './milestoneService';

function makeItem(overrides: Partial<RoadmapItem> = {}): RoadmapItem {
  return {
    id: 'item',
    title: 'Item',
    source: 'project',
    sectionGroup: 'portfolio',
    description: '',
    estimatedHours: 10,
    sequencePosition: 1,
    status: 'not_started',
    isOngoing: false,
    jobReadyThreshold: false,
    userAdded: false,
    ...overrides,
  };
}

function floorItem(status: RoadmapItemStatus): RoadmapItem {
  return makeItem({ jobReadyThreshold: true, status });
}

beforeEach(async () => {
  jest.clearAllMocks();
  await db.milestoneState.clear();
  await db.milestoneState.add({ id: 1, jobReadyNotified: false });
});

describe('isJobReady', () => {
  it('is false if Layer 1 is not complete, regardless of roadmap floor items', async () => {
    mockIsLayer1Complete.mockResolvedValue(false);
    mockGetAllRoadmapItems.mockResolvedValue([floorItem('done'), floorItem('done')]);

    expect(await isJobReady()).toBe(false);
  });

  it('is false if Layer 1 is complete but a floor item is not done', async () => {
    mockIsLayer1Complete.mockResolvedValue(true);
    mockGetAllRoadmapItems.mockResolvedValue([
      floorItem('done'),
      floorItem('in_progress'),
      makeItem({ jobReadyThreshold: false, status: 'not_started' }), // non-floor item, irrelevant
    ]);

    expect(await isJobReady()).toBe(false);
  });

  it('is true once Layer 1 is complete and every floor item is done', async () => {
    mockIsLayer1Complete.mockResolvedValue(true);
    mockGetAllRoadmapItems.mockResolvedValue([
      floorItem('done'),
      floorItem('done'),
      makeItem({ jobReadyThreshold: false, status: 'not_started' }), // strengthening item, doesn't gate
    ]);

    expect(await isJobReady()).toBe(true);
  });

  it('is false if there are no floor items at all (nothing to be ready for)', async () => {
    mockIsLayer1Complete.mockResolvedValue(true);
    mockGetAllRoadmapItems.mockResolvedValue([makeItem({ jobReadyThreshold: false })]);

    expect(await isJobReady()).toBe(false);
  });
});

describe('hasJobReadyBeenNotified / markJobReadyNotified', () => {
  it('reads false when the row has not been notified', async () => {
    expect(await hasJobReadyBeenNotified()).toBe(false);
  });

  it('reads true once notified', async () => {
    await markJobReadyNotified();
    expect(await hasJobReadyBeenNotified()).toBe(true);
  });
});
