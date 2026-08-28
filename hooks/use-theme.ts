'use client';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

/** Raw color values for the current scheme — for SVG/canvas contexts that can't consume a CSS variable directly. Everyday UI should use Tailwind classes (see app/globals.css) instead. */
export function useTheme() {
  const scheme = useColorScheme();
  return Colors[scheme];
}
