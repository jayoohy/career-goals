'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  applyThemePreference,
  readStoredPreference,
  ThemeContext,
  THEME_STORAGE_KEY,
  type ThemePreference,
} from '@/hooks/useThemePreference';

/**
 * Inline snippet for the document <head> (see app/layout.tsx) — runs before first paint so the
 * saved theme is on <html> before anything renders, avoiding a white flash for dark-mode users.
 */
export const THEME_BLOCKING_SCRIPT = `(function(){try{var p=localStorage.getItem('${THEME_STORAGE_KEY}');if(p==='light'||p==='dark'){document.documentElement.setAttribute('data-theme',p);}}catch(e){}})();`;

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');

  useEffect(() => {
    setPreferenceState(readStoredPreference());
  }, []);

  const setPreference = useCallback((next: ThemePreference) => {
    setPreferenceState(next);
    applyThemePreference(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Non-fatal — the choice just won't persist across reloads.
    }
  }, []);

  const value = useMemo(() => ({ preference, setPreference }), [preference, setPreference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
