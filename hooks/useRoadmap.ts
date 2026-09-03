'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  addRoadmapItem,
  deferRoadmapItem,
  deleteRoadmapItem,
  getAllRoadmapItems,
  getSectionGroupProgress,
  getSubStepProgressByItem,
  isRoadmapUnlocked,
  reorderRoadmapItems,
  updateRoadmapItemStatus,
  type NewRoadmapItemInput,
  type RoadmapItemProgress,
  type SectionGroupProgress,
} from '@/services/roadmapService';
import type { RoadmapItem, RoadmapItemStatus } from '@/types/models';

export function useRoadmap() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [unlocked, setUnlocked] = useState(false);
  const [groupProgress, setGroupProgress] = useState<SectionGroupProgress[]>([]);
  const [progressByItem, setProgressByItem] = useState<Record<string, RoadmapItemProgress>>({});
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [nextItems, nextUnlocked, nextProgress, nextItemProgress] = await Promise.all([
        getAllRoadmapItems(),
        isRoadmapUnlocked(),
        getSectionGroupProgress(),
        getSubStepProgressByItem(),
      ]);
      setItems(nextItems);
      setUnlocked(nextUnlocked);
      setGroupProgress(nextProgress);
      setProgressByItem(nextItemProgress);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const setStatus = useCallback(
    async (id: string, status: RoadmapItemStatus) => {
      await updateRoadmapItemStatus(id, status);
      await refresh();
    },
    [refresh],
  );

  const defer = useCallback(
    async (id: string) => {
      await deferRoadmapItem(id);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteRoadmapItem(id);
      await refresh();
    },
    [refresh],
  );

  /** Callers must only invoke this when `unlocked` is true — see PRD §4.2. */
  const reorder = useCallback(
    async (orderedIds: string[]) => {
      await reorderRoadmapItems(orderedIds);
      await refresh();
    },
    [refresh],
  );

  const addItem = useCallback(
    async (input: NewRoadmapItemInput) => {
      await addRoadmapItem(input);
      await refresh();
    },
    [refresh],
  );

  return {
    items,
    unlocked,
    groupProgress,
    progressByItem,
    loading,
    refresh,
    setStatus,
    defer,
    remove,
    reorder,
    addItem,
  };
}
