import type { RestDayBudget } from '@/types/models';

interface RestDayIndicatorProps {
  budget: RestDayBudget | null;
}

export function RestDayIndicator({ budget }: RestDayIndicatorProps) {
  if (!budget) {
    return null;
  }

  const remaining = Math.max(budget.cap - budget.usedCount, 0);
  return (
    <p className="text-sm text-text-secondary">
      {remaining} of {budget.cap} rest days left this month
    </p>
  );
}
