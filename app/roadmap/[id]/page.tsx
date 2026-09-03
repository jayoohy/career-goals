'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';

import { RoadmapChecklist } from '@/components/RoadmapChecklist';
import { ROADMAP_GROUP_LABEL } from '@/constants/roadmap';
import { useRoadmapItem } from '@/hooks/useRoadmapItem';
import { celebrate, tick } from '@/utils/feedback';

export default function RoadmapItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const {
    item,
    subSteps,
    loading,
    toggleStep,
    addStep,
    renameStep,
    removeStep,
    setManualStatus,
    defer,
  } = useRoadmapItem(id);

  if (loading && !item) {
    return null;
  }

  if (!item) {
    return (
      <main className="mx-auto max-w-(--max-content-width) px-6 pb-10">
        <button onClick={() => router.push('/roadmap')} className="text-sm text-text-secondary">
          ← Back to roadmap
        </button>
        <p className="mt-4 text-sm">This step isn&apos;t on your roadmap anymore.</p>
      </main>
    );
  }

  const doneCount = subSteps.filter((s) => s.done).length;
  const percent = subSteps.length > 0 ? Math.round((doneCount / subSteps.length) * 100) : 0;
  const isDeferred = item.status === 'deferred';

  async function handleToggleStep(stepId: string, nextDone: boolean) {
    await toggleStep(stepId, nextDone);
    if (!nextDone) return;
    const willComplete = subSteps.every((s) => s.id === stepId || s.done);
    if (willComplete) celebrate();
    else tick();
  }

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <button
        onClick={() => router.push('/roadmap')}
        className="self-start text-sm text-text-secondary"
      >
        ← Back to roadmap
      </button>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-surface-strong px-2 py-0.5 text-xs font-semibold text-text-secondary">
          {ROADMAP_GROUP_LABEL[item.sectionGroup]}
        </span>
        {item.jobReadyThreshold && (
          <span className="rounded-full bg-streak px-2 py-0.5 text-xs font-semibold text-on-streak">
            Needed to apply
          </span>
        )}
        {item.isOngoing && (
          <span className="rounded-full bg-surface-strong px-2 py-0.5 text-xs font-semibold text-text-secondary">
            Ongoing
          </span>
        )}
      </div>

      <h1 className="font-heading text-3xl font-bold">{item.title}</h1>
      <p className="text-sm text-text-secondary">About {item.estimatedHours} hours</p>
      <p className="text-sm">{item.description}</p>

      {subSteps.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-semibold">
              {doneCount}/{subSteps.length} steps done
            </span>
            <span className="text-text-secondary">{percent}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-surface-strong">
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      {isDeferred && (
        <div className="flex items-center gap-3 rounded-2xl bg-surface p-4">
          <p className="flex-1 text-sm text-text-secondary">This step is set aside for later.</p>
          <button
            onClick={() => setManualStatus('not_started')}
            className="rounded-full bg-surface-strong px-3 py-1.5 text-sm font-semibold"
          >
            Bring back
          </button>
        </div>
      )}

      <RoadmapChecklist
        steps={subSteps}
        onToggle={handleToggleStep}
        onRename={renameStep}
        onDelete={removeStep}
        onAdd={addStep}
      />

      {subSteps.length === 0 && (
        <button
          onClick={() => setManualStatus(item.status === 'done' ? 'not_started' : 'done')}
          className="self-start rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary"
        >
          {item.status === 'done' ? 'Mark not done' : 'Mark this step done'}
        </button>
      )}

      {!isDeferred && (
        <button onClick={defer} className="self-start text-sm text-text-secondary underline">
          Set this aside for later
        </button>
      )}
    </main>
  );
}
