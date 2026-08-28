import type { SectionGroupProgress } from '@/services/roadmapService';
import type { CourseSection } from '@/types/models';

const GROUP_LABEL: Record<SectionGroupProgress['sectionGroup'], string> = {
  course: 'Course',
  core_skills: 'Core skills',
  robotics_track: 'Robotics track',
  portfolio: 'Portfolio',
  deployment: 'Deployment',
  career: 'Career',
};

interface Bar {
  label: string;
  percent: number;
  detail: string;
}

function ProgressBar({ label, percent, detail }: Bar) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between">
        <span className="text-sm">{label}</span>
        <span className="text-sm text-text-secondary">{detail}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-background-element">
        <div className="h-full rounded-full bg-text" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

interface SegmentedProgressBarsProps {
  courseSections: CourseSection[];
  groupProgress: SectionGroupProgress[];
}

/**
 * Layer 1 course bar + one bar per Layer 2 `section_group` — deliberately not a single global
 * percentage (PRD §6, post-v2): each bar reaching 100% is meant to feel like a complete win on
 * its own, independent of what's left elsewhere.
 */
export function SegmentedProgressBars({
  courseSections,
  groupProgress,
}: SegmentedProgressBarsProps) {
  const courseDone = courseSections.filter(
    (s) => s.status === 'done' || s.status === 'skipped',
  ).length;
  const courseTotal = courseSections.length;
  const coursePercent = courseTotal > 0 ? Math.round((courseDone / courseTotal) * 100) : 0;

  return (
    <div className="flex flex-col gap-4">
      <ProgressBar
        label="Layer 1 — Course"
        percent={coursePercent}
        detail={`${courseDone}/${courseTotal}`}
      />
      {groupProgress
        .filter((group) => group.sectionGroup !== 'course')
        .map((group) => (
          <ProgressBar
            key={group.sectionGroup}
            label={GROUP_LABEL[group.sectionGroup]}
            percent={group.percent}
            detail={`${group.done}/${group.total}`}
          />
        ))}
    </div>
  );
}
