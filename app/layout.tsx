import type { Metadata, Viewport } from 'next';

import { AppInit } from '@/components/AppInit';
import { JobReadyNotifier } from '@/components/JobReadyNotifier';
import { NavTabs } from '@/components/NavTabs';

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
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppInit>
          <JobReadyNotifier />
          <NavTabs />
          <div className="pt-20">{children}</div>
        </AppInit>
      </body>
    </html>
  );
}
