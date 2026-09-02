interface Waypoint {
  label: string;
  state: 'done' | 'current' | 'upcoming';
}

interface PathProgressMapProps {
  courseComplete: boolean;
  jobReady: boolean;
}

const DOT_CLASS: Record<Waypoint['state'], string> = {
  done: 'bg-primary',
  current: 'border-2 border-primary bg-background',
  upcoming: 'bg-surface-strong',
};

const LABEL_CLASS: Record<Waypoint['state'], string> = {
  done: 'font-semibold text-text',
  current: 'font-semibold text-text',
  upcoming: 'text-text-secondary',
};

/**
 * Route/waypoint visual for the identity move "frontend developer" → "CV/robotics engineer"
 * (PRD §6) — the emotional anchor, sitting alongside (not replacing) the segmented bars. The
 * final waypoint is framed as a horizon, not an unmet 100% — reaching job-ready doesn't get
 * read as "still not there."
 */
export function PathProgressMap({ courseComplete, jobReady }: PathProgressMapProps) {
  const waypoints: Waypoint[] = [
    { label: 'Frontend developer', state: 'done' },
    { label: 'Finished the course', state: courseComplete ? 'done' : 'current' },
    {
      label: 'Ready to apply for jobs',
      state: jobReady ? 'done' : courseComplete ? 'current' : 'upcoming',
    },
    { label: 'CV / Robotics engineer', state: jobReady ? 'current' : 'upcoming' },
  ];

  return (
    <div className="flex flex-col">
      {waypoints.map((waypoint, index) => (
        <div key={waypoint.label} className="flex">
          <div className="flex w-6 flex-col items-center">
            <span className={`h-3.5 w-3.5 shrink-0 rounded-full ${DOT_CLASS[waypoint.state]}`} />
            {index < waypoints.length - 1 && (
              <span className="min-h-6 w-0.5 grow bg-surface-strong" />
            )}
          </div>
          <span className={`pb-6 pl-2 text-sm ${LABEL_CLASS[waypoint.state]}`}>
            {waypoint.label}
          </span>
        </div>
      ))}
    </div>
  );
}
