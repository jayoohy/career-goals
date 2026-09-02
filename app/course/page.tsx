'use client';

import { useRouter } from 'next/navigation';

import { SectionCard } from '@/components/SectionCard';
import { useCourseProgress } from '@/hooks/useCourseProgress';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useFlaggedSections } from '@/hooks/useFlaggedSections';

export default function CoursePage() {
  const router = useRouter();
  const { sections } = useCourseSections();
  const { flaggedSectionIds } = useFlaggedSections();
  const { meta, progressBySection } = useCourseProgress();

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <h1 className="-mb-2 font-heading text-3xl font-bold">Course</h1>

      {meta && (
        <div className="flex flex-col gap-1 rounded-2xl bg-surface-strong p-4">
          <p className="font-heading font-semibold">{meta.title}</p>
          <p className="text-sm text-text-secondary">Taught by {meta.tutor}</p>
          <p className="text-sm">{meta.description}</p>
          <a
            href={meta.url}
            rel="noreferrer"
            className="mt-1 text-sm font-semibold text-primary underline"
          >
            Open course on Udemy
          </a>
        </div>
      )}

      {sections.map((section) => (
        <SectionCard
          key={section.id}
          section={section}
          flagged={flaggedSectionIds.has(section.id)}
          lessonProgress={progressBySection[section.id] ?? { done: 0, total: section.videoCount }}
          onPress={() => router.push(`/course/${section.id}`)}
        />
      ))}
    </main>
  );
}
