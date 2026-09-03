'use client';

import { db } from '@/services/db';
import { onMutation, setMutationSuppressed } from '@/services/syncBus';
import type { StateSnapshot } from '@/types/models';

/**
 * Whole-database backup/sync (Option A). The client is the working copy; after every change it
 * pushes a full snapshot to the server (debounced), and on launch it pulls — whichever side is
 * newer wins (last-write-wins by timestamp). Enough for one person on one device at a time; it
 * is not a merge engine (see the caveat in the PR/commit).
 *
 * All of it is best-effort: no secret, offline, or a failed request just means this change syncs
 * on the next opportunity. The local data is never at risk from a sync failure.
 */

const SECRET = process.env.NEXT_PUBLIC_PUSH_SHARED_SECRET;
const PUSH_DEBOUNCE_MS = 3000;

const LS_DEVICE_ID = 'career-goals:deviceId';
const LS_MUTATED_AT = 'career-goals:mutatedAt';
const LS_SYNCED_AT = 'career-goals:syncedAt';

/** Every table Dexie knows about — the snapshot is the whole database. */
const SYNCED_TABLES = [
  'courseSections',
  'courseLessons',
  'courseMeta',
  'roadmapItems',
  'roadmapSubSteps',
  'dailyLogs',
  'streakState',
  'restDayBudgets',
  'quizQuestions',
  'quizAttempts',
  'notificationConfig',
  'milestoneState',
] as const;

// ---- local bookkeeping (localStorage; may be evicted with everything else — that's fine, a
// missing value just means "treat as 0", so the server copy wins on the next launch) ----

function readNumber(key: string): number {
  try {
    return Number(localStorage.getItem(key)) || 0;
  } catch {
    return 0;
  }
}

function writeNumber(key: string, value: number): void {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    /* ignore */
  }
}

function getDeviceId(): string {
  try {
    let id = localStorage.getItem(LS_DEVICE_ID);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(LS_DEVICE_ID, id);
    }
    return id;
  } catch {
    return 'unknown-device';
  }
}

export function getLastSyncedAt(): number | null {
  const v = readNumber(LS_SYNCED_AT);
  return v > 0 ? v : null;
}

// ---- status listeners (for the Settings "Backup" card) ----

type Listener = () => void;
const listeners = new Set<Listener>();

export function subscribeSyncStatus(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(): void {
  listeners.forEach((fn) => fn());
}

// ---- "has real activity?" checks — the data-safety guard around applySnapshot ----
//
// The timestamp comparison alone isn't safe: if localStorage gets cleared but IndexedDB
// survives (possible on iOS), `localMutatedAt` reads 0 and a stale/empty remote would wrongly
// "win" and wipe real local data. So we also ask: does each side actually have any logged
// activity? Real local data is never overwritten by an emptier remote.

async function localHasActivity(): Promise<boolean> {
  const [logs, attempts, doneLessons, doneSteps] = await Promise.all([
    db.dailyLogs.count(),
    db.quizAttempts.count(),
    db.courseLessons.filter((l) => l.done).count(),
    db.roadmapSubSteps.filter((s) => s.done).count(),
  ]);
  const streak = await db.streakState.get(1);
  return (
    logs > 0 || attempts > 0 || doneLessons > 0 || doneSteps > 0 || (streak?.longestStreak ?? 0) > 0
  );
}

function snapshotHasActivity(snapshot: StateSnapshot): boolean {
  const t = snapshot.tables;
  const rows = (name: string) =>
    Array.isArray(t[name]) ? (t[name] as Record<string, unknown>[]) : [];
  const streak = rows('streakState')[0] as { longestStreak?: number } | undefined;
  return (
    rows('dailyLogs').length > 0 ||
    rows('quizAttempts').length > 0 ||
    rows('courseLessons').some((l) => l.done) ||
    rows('roadmapSubSteps').some((s) => s.done) ||
    (streak?.longestStreak ?? 0) > 0
  );
}

// ---- serialize / apply ----

async function serializeTables(): Promise<Record<string, unknown[]>> {
  const tables: Record<string, unknown[]> = {};
  for (const name of SYNCED_TABLES) {
    tables[name] = await db.table(name).toArray();
  }
  return tables;
}

async function applySnapshot(snapshot: StateSnapshot): Promise<void> {
  setMutationSuppressed(true);
  try {
    await db.transaction('rw', db.tables, async () => {
      for (const name of SYNCED_TABLES) {
        const rows = snapshot.tables[name];
        if (!Array.isArray(rows)) continue; // table absent in an older snapshot — leave local as-is
        await db.table(name).clear();
        if (rows.length > 0) await db.table(name).bulkAdd(rows);
      }
    });
  } finally {
    setMutationSuppressed(false);
  }
  writeNumber(LS_MUTATED_AT, snapshot.updatedAt);
  writeNumber(LS_SYNCED_AT, snapshot.updatedAt);
  emit();
}

// ---- network ----

async function fetchRemote(): Promise<StateSnapshot | null> {
  const res = await fetch('/api/state', {
    headers: { Authorization: `Bearer ${SECRET}` },
  });
  if (!res.ok) throw new Error(`GET /api/state ${res.status}`);
  const body = (await res.json()) as { snapshot: StateSnapshot | null };
  return body.snapshot ?? null;
}

let pushInFlight: Promise<void> | null = null;

async function pushNow(): Promise<void> {
  if (!SECRET) return;
  if (pushInFlight) return pushInFlight;

  pushInFlight = (async () => {
    const updatedAt = Date.now();
    const snapshot: StateSnapshot = {
      updatedAt,
      deviceId: getDeviceId(),
      tables: await serializeTables(),
    };

    const res = await fetch('/api/state', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${SECRET}` },
      body: JSON.stringify(snapshot),
    });

    if (res.status === 409) {
      // Someone else wrote something newer — take their copy.
      const body = (await res.json()) as { snapshot: StateSnapshot };
      await applySnapshot(body.snapshot);
      return;
    }
    if (!res.ok) throw new Error(`PUT /api/state ${res.status}`);

    writeNumber(LS_MUTATED_AT, updatedAt);
    writeNumber(LS_SYNCED_AT, updatedAt);
    emit();
  })();

  try {
    await pushInFlight;
  } finally {
    pushInFlight = null;
  }
}

let debounceTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePush(): void {
  if (!SECRET) return;
  writeNumber(LS_MUTATED_AT, Date.now());
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void pushNow().catch((e) => console.error('State push failed', e));
  }, PUSH_DEBOUNCE_MS);
}

// ---- public entry points ----

/** Wire the Dexie mutation middleware to the debounced push. Call once, before the DB opens. */
export function initSync(): void {
  onMutation(schedulePush);
}

/**
 * On launch, reconcile local with the server backup:
 *  - no remote yet → push local (establish the backup)
 *  - local has no activity but remote does → restore from remote (new device / wiped storage)
 *  - both have activity → newer-by-timestamp wins (last-write-wins); if the local timestamp is
 *    missing we keep local and push, never letting an emptier/older remote clobber real data
 *  - otherwise → push local
 */
export async function syncOnStart(): Promise<void> {
  if (!SECRET) return;
  try {
    const remote = await fetchRemote();
    if (!remote) {
      await pushNow();
      return;
    }

    const localActive = await localHasActivity();
    const remoteActive = snapshotHasActivity(remote);
    const localMutatedAt = readNumber(LS_MUTATED_AT);

    if (!localActive && remoteActive) {
      await applySnapshot(remote);
    } else if (
      localActive &&
      remoteActive &&
      localMutatedAt > 0 &&
      remote.updatedAt > localMutatedAt
    ) {
      await applySnapshot(remote); // worked on another device more recently — accepted LWW
    } else {
      await pushNow();
    }
  } catch (e) {
    console.error('Initial sync failed (working offline is fine)', e);
  }
}

/** Manual "Sync now" — flush any pending push immediately, then reconcile with the server. */
export async function syncNow(): Promise<void> {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }
  await syncOnStart();
}
