import { ImageResponse } from 'next/og';

// Placeholder apple-touch-icon (used by "Add to Home Screen") — see app/api/icon/route.tsx for the swap-out note.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#208AEF',
          color: '#ffffff',
          fontSize: 72,
          fontWeight: 700,
        }}
      >
        CG
      </div>
    ),
    size,
  );
}
