import { CheckIcon } from '@/components/icons';

type StepState = 'done' | 'next' | 'todo';

interface RoadmapStepProps {
  /** 1-based position in the sequence. */
  number: number;
  state: StepState;
  isLast: boolean;
  children: React.ReactNode;
}

const MARKER_CLASS: Record<StepState, string> = {
  done: 'bg-primary text-on-primary',
  next: 'bg-primary text-on-primary ring-4 ring-primary/20',
  todo: 'bg-surface-strong text-text-secondary',
};

/**
 * One step in the roadmap "path" — a numbered marker and the connecting spine down to the next
 * step, with the item's card to the right. Turns the flat list (feedback: "a bunch of
 * unexplainable text") into something that reads as a route with a clear next stop.
 */
export function RoadmapStep({ number, state, isLast, children }: RoadmapStepProps) {
  return (
    <div className="flex gap-3">
      <div className="flex w-8 shrink-0 flex-col items-center">
        <span
          className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold font-heading ${MARKER_CLASS[state]}`}
        >
          {state === 'done' ? <CheckIcon className="h-4 w-4" /> : number}
        </span>
        {!isLast && <span className="mt-1 w-0.5 grow rounded-full bg-surface-strong" />}
      </div>
      <div className="min-w-0 flex-1 pb-4">{children}</div>
    </div>
  );
}
