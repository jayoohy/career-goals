import { ImageResponse } from 'next/og';
import type { NextRequest } from 'next/server';

/**
 * Placeholder PWA icon generator, sized via ?size= — feeds `app/manifest.ts`'s 192/512 entries.
 * TEMPORARY: per the PRD's resolved open question, Joy will source a real icon later. Swap this
 * out by replacing the manifest's icon `src` values with real files under /public/icons and
 * deleting this route (also drop the corresponding entries from app/icon.tsx / app/apple-icon.tsx).
 */
export async function GET(request: NextRequest) {
  const size = Number(request.nextUrl.searchParams.get('size') ?? '512');

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#059669',
        color: '#ffffff',
        fontSize: size * 0.4,
        fontWeight: 700,
      }}
    >
      CG
    </div>,
    { width: size, height: size },
  );
}
