'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
  { href: '/', label: 'Today' },
  { href: '/course', label: 'Course' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/progress', label: 'Progress' },
  { href: '/settings', label: 'Settings' },
] as const;

/**
 * Web equivalent of the Expo app's app-tabs.tsx (expo-router/ui's Tabs/TabList/TabTrigger) — a
 * floating pill nav bar, same visual language (brand text + rounded tab buttons), built on
 * plain Next.js Link/usePathname since there's no native tab-bar primitive on the web.
 */
export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 top-0 z-50 flex justify-center p-4">
      <div className="flex max-w-(--max-content-width) grow items-center gap-2 rounded-full bg-background-element px-8 py-2">
        <span className="mr-auto text-sm font-bold">Career Goals</span>
        {TABS.map((tab) => {
          const isActive = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={
                isActive
                  ? 'rounded-2xl bg-background-selected px-4 py-1 text-sm text-text'
                  : 'rounded-2xl bg-background-element px-4 py-1 text-sm text-text-secondary hover:text-text'
              }
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
