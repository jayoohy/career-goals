/**
 * Ask the browser to keep this origin's storage (the Dexie/IndexedDB database) from being
 * evicted under storage pressure or the "cleared after N days unused" rules some browsers apply
 * — notably iOS Safari, where an un-persisted PWA can lose its whole local database.
 *
 * Best-effort: the browser may grant, deny, or not support it. Safe to call on every launch.
 * (The server-side backup in syncService is the real safety net; this just widens the gap
 * between evictions.)
 */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    if (!navigator.storage?.persist) return false;
    if (await navigator.storage.persisted()) return true;
    return await navigator.storage.persist();
  } catch {
    return false;
  }
}
