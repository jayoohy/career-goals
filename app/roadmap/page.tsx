'use client';

import { useState } from 'react';

import { RoadmapItemCard } from '@/components/RoadmapItemCard';
import { useRoadmap } from '@/hooks/useRoadmap';

export default function RoadmapPage() {
  const { items, unlocked, setStatus, defer, reorder, addItem } = useRoadmap();
  const [addingNew, setAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

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
      <h1 className="-mb-2 text-4xl font-semibold">Roadmap</h1>
      {!unlocked && (
        <p className="text-sm text-text-secondary">
          Locked for reordering until Layer 1 is complete — you can still work items in order.
        </p>
      )}

      {items.map((item, index) => (
        <RoadmapItemCard
          key={item.id}
          item={item}
          unlocked={unlocked}
          isFirst={index === 0}
          isLast={index === items.length - 1}
          onStatusChange={(next) => setStatus(item.id, next)}
          onDefer={() => defer(item.id)}
          onMoveUp={() => moveItem(index, -1)}
          onMoveDown={() => moveItem(index, 1)}
        />
      ))}

      {addingNew ? (
        <div className="flex flex-col gap-2 rounded-2xl bg-background-element p-4">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Title"
            className="rounded-lg border border-background-selected bg-transparent p-2 text-text"
          />
          <input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Description (optional)"
            className="rounded-lg border border-background-selected bg-transparent p-2 text-text"
          />
          <div className="flex items-center gap-4">
            <button
              onClick={handleAddItem}
              className="rounded-2xl bg-background-selected p-4 text-center text-sm font-bold"
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
          className="rounded-2xl bg-background-element p-4 text-center text-sm font-bold"
        >
          + Add item
        </button>
      )}
    </main>
  );
}
