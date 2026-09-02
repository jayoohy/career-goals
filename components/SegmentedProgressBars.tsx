import type { SectionGroupProgress } from '@/services/roadmapService';

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
        <span className="text-sm font-semibold">{label}</span>
        <span className="text-sm text-text-secondary">{detail}</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-strong">
        <div
          className="h-full rounded-full bg-primary transition-[width]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

interface SegmentedProgressBarsProps {
  layer1Percent: number;
  layer1Detail: string;
  groupProgress: SectionGroupProgress[];
}

/**
 * Layer 1 course bar + one bar per Layer 2 `section_group` — deliberately not a single global
 * percentage (PRD §6, post-v2): each bar reaching 100% is meant to feel like a complete win on
 * its own, independent of what's left elsewhere. Layer 1's percent is lesson-level (real videos
 * watched / total), not just "sections fully done" — much smoother, and no longer sits blank at
 * 0% while a section is genuinely in progress.
 */
export function SegmentedProgressBars({
  layer1Percent,
  layer1Detail,
  groupProgress,
}: SegmentedProgressBarsProps) {
  return (
    <div className="flex flex-col gap-4">
      <ProgressBar label="Course" percent={layer1Percent} detail={layer1Detail} />
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
