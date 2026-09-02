'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { CourseIcon, ProgressIcon, RoadmapIcon, SettingsIcon, TodayIcon } from '@/components/icons';

const TABS = [
  { href: '/', label: 'Today', Icon: TodayIcon },
  { href: '/course', label: 'Course', Icon: CourseIcon },
  { href: '/roadmap', label: 'Roadmap', Icon: RoadmapIcon },
  { href: '/progress', label: 'Progress', Icon: ProgressIcon },
  { href: '/settings', label: 'Settings', Icon: SettingsIcon },
] as const;

/**
 * Bottom tab bar — replaces the earlier floating top pill, which clipped content and let page
 * text render above/through it on narrow screens. A full-width bottom bar is also the standard
 * mobile pattern (bottom-nav-limit, tab-bar-ios): 5 items max, icon+label, safe-area aware.
 */
export function NavTabs() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 flex justify-around border-t border-border bg-background"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className="flex min-w-11 flex-1 flex-col items-center gap-1 py-2.5 text-center"
          >
            <Icon
              active={isActive}
              className={`h-6 w-6 ${isActive ? 'text-primary' : 'text-text-secondary'}`}
            />
            <span
              className={`text-xs ${isActive ? 'font-semibold text-primary' : 'text-text-secondary'}`}
            >
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
