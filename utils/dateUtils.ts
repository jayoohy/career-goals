/** All dates in this app are local-day strings ("YYYY-MM-DD"), never UTC ISO timestamps — a "day" means the user's local calendar day. */

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export function toLocalDateString(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

export function todayLocalDate(): string {
  return toLocalDateString(new Date());
}

export function currentMonthKey(date: string): string {
  return date.slice(0, 7);
}

export function addDaysToDateString(date: string, days: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return toLocalDateString(d);
}

/** Whole-day difference (b - a), e.g. daysBetween('2026-08-20', '2026-08-21') === 1. */
export function daysBetween(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((Date.UTC(by, bm - 1, bd) - Date.UTC(ay, am - 1, ad)) / msPerDay);
}

const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatFriendlyDate(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return `${MONTH_LABELS[month - 1]} ${day}, ${year}`;
}

/** "just now" / "5 minutes ago" / "3 hours ago" / "2 days ago" — for the backup status line. */
export function formatRelativeTime(epochMs: number, now: number = Date.now()): string {
  const seconds = Math.round((now - epochMs) / 1000);
  if (seconds < 45) return 'just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
