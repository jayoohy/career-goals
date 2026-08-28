'use client';

import { useEffect, useState } from 'react';

export type ColorScheme = 'light' | 'dark';

function getSystemScheme(): ColorScheme {
  if (typeof window === 'undefined') {
    return 'light';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

/** Tracks the OS color scheme reactively — used only where a component needs a raw color value (e.g. SVG fills); everyday UI should prefer Tailwind's dark: classes over this. */
export function useColorScheme(): ColorScheme {
  const [scheme, setScheme] = useState<ColorScheme>(getSystemScheme);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => setScheme(event.matches ? 'dark' : 'light');
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return scheme;
}
