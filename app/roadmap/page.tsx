'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { RoadmapItemCard } from '@/components/RoadmapItemCard';
import { RoadmapStep } from '@/components/RoadmapStep';
import { useCourseSections } from '@/hooks/useCourseSections';
import { useRoadmap } from '@/hooks/useRoadmap';

export default function RoadmapPage() {
  const router = useRouter();
  const { sections } = useCourseSections();
  const { items, unlocked, progressByItem, reorder, addItem } = useRoadmap();
  const [addingNew, setAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const courseDone = sections.filter((s) => s.status === 'done' || s.status === 'skipped').length;
  const nextUpId = items.find((item) => item.status !== 'done' && item.status !== 'deferred')?.id;
  const doneCount = items.filter((item) => item.status === 'done').length;

  function moveItem(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const orderedIds = items.map((item) => item.id);
    [orderedIds[index], orderedIds[targetIndex]] = [orderedIds[targetIndex], orderedIds[index]];
    reorder(orderedIds);
  }

  async function handleAddItem() {
    if (!newTitle.trim()) return;
    await addItem({
      title: newTitle.trim(),
      description: newDescription.trim() || 'Added by Joy.',
      source: 'project',
      sectionGroup: 'portfolio',
      estimatedHours: 10,
    });
    setNewTitle('');
    setNewDescription('');
    setAddingNew(false);
  }

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col gap-4 px-6 pb-10">
      <h1 className="-mb-2 font-heading text-3xl font-bold">Roadmap</h1>
      <p className="text-sm text-text-secondary">
        Your route to CV / robotics engineer — {doneCount} of {items.length} steps done.
      </p>

      <button
        onClick={() => router.push('/course')}
        className="flex items-center justify-between rounded-2xl bg-surface-strong p-4 text-left"
      >
        <div>
          <p className="font-heading font-semibold">The course — start here</p>
          <p className="text-sm text-text-secondary">
            {courseDone}/{sections.length} sections done · then work through the steps below
          </p>
        </div>
        <span className="text-text-secondary">→</span>
      </button>

      {!unlocked && (
        <p className="text-sm text-text-secondary">
          You can reorder these once the course is done. For now, work them top to bottom.
        </p>
      )}

      <div className="flex flex-col">
        {items.map((item, index) => (
          <RoadmapStep
            key={item.id}
            number={index + 1}
            state={item.status === 'done' ? 'done' : item.id === nextUpId ? 'next' : 'todo'}
            isLast={index === items.length - 1}
          >
            <RoadmapItemCard
              item={item}
              progress={progressByItem[item.id] ?? { done: 0, total: 0 }}
              unlocked={unlocked}
              isNext={item.id === nextUpId}
              isFirst={index === 0}
              isLast={index === items.length - 1}
              onPress={() => router.push(`/roadmap/${item.id}`)}
              onMoveUp={() => moveItem(index, -1)}
              onMoveDown={() => moveItem(index, 1)}
            />
          </RoadmapStep>
        ))}
      </div>

      {addingNew ? (
        <div className="flex flex-col gap-2 rounded-2xl bg-surface p-4">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className="min-h-11 rounded-xl border border-border bg-transparent p-2 text-text"
          />
          <input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="min-h-11 rounded-xl border border-border bg-transparent p-2 text-text"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddItem}
              className="rounded-2xl bg-primary p-3 text-center font-heading font-semibold text-on-primary"
            >
              Add
            </button>
            <button onClick={() => setAddingNew(false)} className="text-sm text-text-secondary">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingNew(true)}
          className="rounded-2xl bg-surface p-4 text-center font-heading font-semibold"
        >
          + Add item
        </button>
      )}
    </main>
  );
}
