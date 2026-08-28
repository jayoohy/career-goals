import { JOB_READY_COPY } from '@/constants/copy';

interface JobReadyBadgeProps {
  jobReady: boolean;
}

/**
 * Persistent marker once `isJobReady()` is true (PRD §4.3) — a standing reminder, not a toast
 * that can be missed. Renders nothing before the floor is crossed; not a percentage or a bar.
 */
export function JobReadyBadge({ jobReady }: JobReadyBadgeProps) {
  if (!jobReady) {
    return null;
  }

  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-streak p-4 text-on-streak">
      <p className="font-heading font-semibold">{JOB_READY_COPY.title}</p>
      <p className="text-sm opacity-90">{JOB_READY_COPY.body}</p>
    </div>
  );
}
