import { urlBase64ToUint8Array } from '@/utils/webPush';

/** True only once the PWA is running as an installed home-screen app — iOS only supports Web Push in that mode, not in a regular Safari tab (PRD requirement 25). */
export function isRunningAsInstalledApp(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  const iosStandalone = (window.navigator as { standalone?: boolean }).standalone === true;
  return window.matchMedia('(display-mode: standalone)').matches || iosStandalone;
}

export function isPushSupported(): boolean {
  return typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window;
}

export async function getExistingSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) {
    return null;
  }
  const registration = await navigator.serviceWorker.ready;
  return registration.pushManager.getSubscription();
}

/** Requests notification permission, subscribes via the browser's Push API, and registers the subscription with the server. Throws if permission is denied or push isn't supported — callers should surface that as a message, not a crash. */
export async function subscribeToPush(): Promise<void> {
  if (!isPushSupported()) {
    throw new Error('Push notifications are not supported in this browser.');
  }

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const secret = process.env.NEXT_PUBLIC_PUSH_SHARED_SECRET;
  if (!publicKey || !secret) {
    throw new Error('Push notification configuration is missing.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    // Cast needed because TS's lib.dom types are stricter about ArrayBuffer vs. ArrayBufferLike
    // than the actual DOM API — the browser accepts any BufferSource here.
    applicationServerKey: urlBase64ToUint8Array(publicKey) as BufferSource,
  });

  const json = subscription.toJSON();
  await fetch('/api/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${secret}` },
    body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys }),
  });
}
