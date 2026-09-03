'use client';

import { useCallback, useEffect, useState } from 'react';

import {
  deferRoadmapItem,
  getRoadmapItemById,
  updateRoadmapItemStatus,
} from '@/services/roadmapService';
import {
  addSubStep,
  deleteSubStep,
  getSubStepsForItem,
  renameSubStep,
  toggleSubStep,
} from '@/services/roadmapSubStepService';
import type { RoadmapItem, RoadmapItemStatus, RoadmapSubStep } from '@/types/models';

/** Drives the roadmap item detail page — the item, its checklist, and every edit on it. */
export function useRoadmapItem(id: string) {
  const [item, setItem] = useState<RoadmapItem | null>(null);
  const [subSteps, setSubSteps] = useState<RoadmapSubStep[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [nextItem, nextSteps] = await Promise.all([
        getRoadmapItemById(id),
        getSubStepsForItem(id),
      ]);
      setItem(nextItem);
      setSubSteps(nextSteps);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const toggleStep = useCallback(
    async (stepId: string, done: boolean) => {
      await toggleSubStep(stepId, done);
      await refresh();
    },
    [refresh],
  );

  const addStep = useCallback(
    async (title: string) => {
      await addSubStep(id, title);
      await refresh();
    },
    [id, refresh],
  );

  const renameStep = useCallback(
    async (stepId: string, title: string) => {
      await renameSubStep(stepId, title);
      await refresh();
    },
    [refresh],
  );

  const removeStep = useCallback(
    async (stepId: string) => {
      await deleteSubStep(stepId);
      await refresh();
    },
    [refresh],
  );

  /** Manual done / not-done — only meaningful for an item with no checklist yet. */
  const setManualStatus = useCallback(
    async (status: RoadmapItemStatus) => {
      await updateRoadmapItemStatus(id, status);
      await refresh();
    },
    [id, refresh],
  );

  const defer = useCallback(async () => {
    await deferRoadmapItem(id);
    await refresh();
  }, [id, refresh]);

  return {
    item,
    subSteps,
    loading,
    refresh,
    toggleStep,
    addStep,
    renameStep,
    removeStep,
    setManualStatus,
    defer,
  };
}
