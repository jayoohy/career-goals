'use client';

import { useEffect } from 'react';

/**
 * Last-resort boundary for an error thrown in the root layout itself (where app/error.tsx can't
 * help). Ships its own <html>/<body> per Next's contract, so it can't use the app's Tailwind
 * tokens — inline styles only.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App failed to start', error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          fontFamily: 'system-ui, sans-serif',
          padding: 24,
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontSize: 22 }}>The app couldn’t start</h1>
        <p style={{ color: '#78716c', fontSize: 14 }}>Close it fully and open it again.</p>
        <button
          onClick={reset}
          style={{
            background: '#059669',
            color: '#fff',
            border: 'none',
            borderRadius: 16,
            padding: '12px 24px',
            fontSize: 16,
            fontWeight: 600,
          }}
        >
          Reload
        </button>
      </body>
    </html>
  );
}
