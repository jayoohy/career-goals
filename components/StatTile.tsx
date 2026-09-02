interface StatTileProps {
  label: string;
  value: string;
  /** Optional leading glyph (e.g. a flame for the streak). */
  icon?: React.ReactNode;
}

/** One number worth glancing at — used in the Progress page's top row. */
export function StatTile({ label, value, icon }: StatTileProps) {
  return (
    <div className="flex flex-1 flex-col items-center gap-1 rounded-2xl bg-surface p-3 text-center">
      <span className="flex items-center gap-1 font-heading text-2xl font-bold">
        {icon}
        {value}
      </span>
      <span className="text-xs text-text-secondary">{label}</span>
    </div>
  );
}
