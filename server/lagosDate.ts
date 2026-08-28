/**
 * Server-side "today," computed explicitly for Lagos (WAT, UTC+1, no DST — PRD §7) rather than
 * relying on the server runtime's own timezone (Vercel functions run in UTC). Using UTC getters
 * plus an explicit offset keeps this correct regardless of the host's default timezone.
 */
const LAGOS_UTC_OFFSET_HOURS = 1;

function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

export function todayInLagos(): string {
  const shifted = new Date(Date.now() + LAGOS_UTC_OFFSET_HOURS * 60 * 60 * 1000);
  return `${shifted.getUTCFullYear()}-${pad2(shifted.getUTCMonth() + 1)}-${pad2(shifted.getUTCDate())}`;
}
