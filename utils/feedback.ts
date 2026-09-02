/**
 * Small, cheap "nice, that worked" feedback — a soft synthesized chime and a haptic tap. No
 * audio files, no library: a short WebAudio blip generated on the fly. Everything is guarded for
 * SSR and for browsers/devices that don't support it, and it all stays silent unless the user
 * has left "Sounds & haptics" on (Settings).
 */

const STORAGE_KEY = 'career-goals:feedback-enabled';

let enabled = true;
let audioContext: AudioContext | null = null;

export function loadFeedbackPreference(): boolean {
  try {
    enabled = localStorage.getItem(STORAGE_KEY) !== 'false';
  } catch {
    enabled = true;
  }
  return enabled;
}

export function setFeedbackEnabled(next: boolean): void {
  enabled = next;
  try {
    localStorage.setItem(STORAGE_KEY, String(next));
  } catch {
    // Non-fatal — preference just won't persist.
  }
}

export function isFeedbackEnabled(): boolean {
  return enabled;
}

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ??
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioContext) audioContext = new Ctor();
  return audioContext;
}

function blip(frequency: number, durationMs: number, gain = 0.05): void {
  if (!enabled) return;
  const ctx = getContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') void ctx.resume();

  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  amp.gain.setValueAtTime(gain, ctx.currentTime);
  amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
  osc.connect(amp).connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + durationMs / 1000);
}

function haptic(pattern: number | number[]): void {
  if (!enabled) return;
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Unsupported — ignore.
  }
}

/** A single soft tick — ticking a video off, small confirmations. */
export function tick(): void {
  blip(660, 70);
  haptic(8);
}

/** A short rising two-note chime — a study session logged, a step marked done. */
export function chime(): void {
  blip(523.25, 90);
  setTimeout(() => blip(783.99, 140), 90);
  haptic(14);
}

/** A brighter three-note flourish — a milestone (quiz passed, streak extended, job-ready). */
export function celebrate(): void {
  blip(523.25, 90);
  setTimeout(() => blip(659.25, 90), 90);
  setTimeout(() => blip(987.77, 200), 180);
  haptic([12, 40, 12]);
}
