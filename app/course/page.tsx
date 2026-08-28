'use client';

import { useRouter } from 'next/navigation';

import { SectionCard } from '@/components/SectionCard';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useFlaggedSections } from '@/hooks/useFlaggedSections';

export default function CoursePage() {
  const router = useRouter();
  const { sections } = useCourseSections();
  const { flaggedSectionIds } = useFlaggedSections();

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <h1 className="-mb-2 text-4xl font-semibold">Course</h1>
      {sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          flagged={flaggedSectionIds.has(section.id)}
          onPress={() => router.push(`/course/${section.id}`)}
        />
      ))}
    </main>
  );
}
