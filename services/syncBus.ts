/**
 * Tiny decoupling layer between the Dexie mutation middleware (services/db.ts) and the sync
 * engine (services/syncService.ts), so neither has to import the other. db.ts calls
 * `notifyMutation()` after every write; syncService registers the handler and toggles
 * suppression while it applies a snapshot pulled from the server (so that doesn't loop back
 * into a push).
 */

let suppressed = false;
let handler: (() => void) | null = null;

export function setMutationSuppressed(value: boolean): void {
  suppressed = value;
}

export function onMutation(fn: () => void): void {
  handler = fn;
}

export function notifyMutation(): void {
  if (!suppressed) handler?.();
}
