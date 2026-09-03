'use client';

import { useState } from 'react';

import { CheckIcon, TrashIcon } from '@/components/icons';
import type { RoadmapSubStep } from '@/types/models';

interface RoadmapChecklistProps {
  steps: RoadmapSubStep[];
  onToggle: (stepId: string, done: boolean) => void;
  onRename: (stepId: string, title: string) => void;
  onDelete: (stepId: string) => void;
  onAdd: (title: string) => void;
}

/** The editable step list on a roadmap item's detail page — check, rename (tap the text), delete, add. */
export function RoadmapChecklist({
  steps,
  onToggle,
  onRename,
  onDelete,
  onAdd,
}: RoadmapChecklistProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const [newTitle, setNewTitle] = useState('');

  function commitRename(stepId: string) {
    const trimmed = draft.trim();
    if (trimmed) onRename(stepId, trimmed);
    setEditingId(null);
  }

  function commitAdd() {
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setNewTitle('');
  }

  return (
    <div className="flex flex-col gap-1">
      {steps.map((step) => (
        <div key={step.id} className="flex items-center gap-3 rounded-xl p-2">
          <button
            onClick={() => onToggle(step.id, !step.done)}
            aria-label={step.done ? 'Mark not done' : 'Mark done'}
            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
              step.done ? 'border-primary bg-primary' : 'border-border'
            }`}
          >
            {step.done && <CheckIcon className="h-4 w-4 text-on-primary" />}
          </button>

          {editingId === step.id ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => commitRename(step.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') commitRename(step.id);
                if (e.key === 'Escape') setEditingId(null);
              }}
              className="min-h-9 flex-1 rounded-lg border border-border bg-transparent px-2 text-sm text-text"
            />
          ) : (
            <button
              onClick={() => {
                setEditingId(step.id);
                setDraft(step.title);
              }}
              className={`flex-1 text-left text-sm ${
                step.done ? 'text-text-secondary line-through' : 'text-text'
              }`}
            >
              {step.title}
            </button>
          )}

          <button
            onClick={() => onDelete(step.id)}
            aria-label={`Delete step: ${step.title}`}
            className="shrink-0 text-text-secondary"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}

      <div className="mt-1 flex items-center gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && commitAdd()}
          placeholder="Add a step"
          className="min-h-11 flex-1 rounded-xl border border-border bg-transparent px-3 text-sm text-text"
        />
        <button
          onClick={commitAdd}
          disabled={!newTitle.trim()}
          className="min-h-11 rounded-xl bg-surface-strong px-4 text-sm font-semibold disabled:opacity-50"
        >
          Add
        </button>
      </div>
    </div>
  );
}
