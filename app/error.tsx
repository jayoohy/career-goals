'use client';

import { useEffect } from 'react';

/**
 * Catches any render/data error inside a route so a single bad screen shows a recoverable
 * message instead of the raw "application error" page (reported during first real use). The
 * local database keeps working — "Try again" re-mounts the screen.
 */
export default function RouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Screen failed to load', error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-(--max-content-width) flex-col items-center gap-4 px-6 py-16 text-center">
      <h1 className="font-heading text-2xl font-bold">This screen hit a snag</h1>
      <p className="text-sm text-text-secondary">
        Your logged time and streak are safe. Try loading it again.
      </p>
      <button
        onClick={reset}
        className="rounded-2xl bg-primary px-6 py-3 font-heading font-semibold text-on-primary active:scale-[0.98]"
      >
        Try again
      </button>
    </main>
  );
}
