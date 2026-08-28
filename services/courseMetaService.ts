import { db } from '@/services/db';
import type { CourseMeta } from '@/types/models';

export async function getCourseMeta(): Promise<CourseMeta | null> {
  const row = await db.courseMeta.get(1);
  return row ?? null;
}
