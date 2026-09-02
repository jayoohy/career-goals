'use client';

interface StepperFieldProps {
  label: string;
  helper?: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}

/**
 * Bounded +/- number control — used where a free-text number field previously let any value
 * through (e.g. the monthly rest-day limit). Keeps input inside [min, max] with no keyboard.
 */
export function StepperField({ label, helper, value, min, max, onChange }: StepperFieldProps) {
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <p className="text-sm">{label}</p>
        {helper && <p className="text-xs text-text-secondary">{helper}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(clamp(value - 1))}
          disabled={value <= min}
          aria-label={`Decrease ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-strong text-lg font-semibold disabled:opacity-40"
        >
          −
        </button>
        <span className="w-6 text-center font-heading font-semibold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(clamp(value + 1))}
          disabled={value >= max}
          aria-label={`Increase ${label}`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-strong text-lg font-semibold disabled:opacity-40"
        >
          +
        </button>
      </div>
    </div>
  );
}
