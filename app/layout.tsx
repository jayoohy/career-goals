import type { Metadata, Viewport } from 'next';

import { AppInit } from '@/components/AppInit';
import { JobReadyNotifier } from '@/components/JobReadyNotifier';
import { NavTabs } from '@/components/NavTabs';
import { OnboardingGate } from '@/components/OnboardingGate';
import { ThemeProvider, THEME_BLOCKING_SCRIPT } from '@/components/ThemeProvider';

import './globals.css';

export const metadata: Metadata = {
  title: 'Career Goals',
  description: "Joy's CV/Robotics accountability tracker.",
  // manifest link is auto-injected by app/manifest.ts — no manual href needed.
  appleWebApp: {
    // iOS predates full manifest support for "Add to Home Screen" — these tags are what it
    // actually reads to install standalone (manifest.ts covers every other browser).
    capable: true,
    statusBarStyle: 'default',
    title: 'Career Goals',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#059669' },
    { media: '(prefers-color-scheme: dark)', color: '#121212' },
  ],
  viewportFit: 'cover', // required for env(safe-area-inset-*) to resolve on iOS
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BLOCKING_SCRIPT }} />
      </head>
      <body>
        <ThemeProvider>
          <AppInit>
            <JobReadyNotifier />
            <OnboardingGate>
              <div
                className="pt-6"
                style={{ paddingBottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom))' }}
              >
                {children}
              </div>
              <NavTabs />
            </OnboardingGate>
          </AppInit>
        </ThemeProvider>
      </body>
    </html>
  );
}
