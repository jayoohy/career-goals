'use client';

import { useCallback, useEffect, useState } from 'react';

import { getAllCourseSections, skipSection } from '@/services/courseSectionService';
import type { CourseSection } from '@/types/models';

export function useCourseSections() {
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setSections(await getAllCourseSections());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const skip = useCallback(
    async (id: string) => {
      await skipSection(id);
      await refresh();
    },
    [refresh],
  );

  return { sections, loading, refresh, skip };
}
