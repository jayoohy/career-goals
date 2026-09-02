'use client';

import { useThemePreference, type ThemePreference } from '@/hooks/useThemePreference';

const OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

/** Segmented System / Light / Dark control for the Settings page. */
export function ThemeToggle() {
  const { preference, setPreference } = useThemePreference();

  return (
    <div className="flex gap-1 rounded-full bg-surface-strong p-1">
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => setPreference(value)}
          className={`flex-1 rounded-full px-3 py-1.5 text-sm font-semibold ${
            preference === value ? 'bg-primary text-on-primary' : 'text-text-secondary'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
