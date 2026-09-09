'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TEAMS, type TeamSlug } from '@/types';
import { cn } from '@/lib/utils';

export function TeamNav({ teamSlug }: { teamSlug: TeamSlug }) {
  const pathname = usePathname();
  const config = TEAMS.find((t) => t.slug === teamSlug);

  const tabs: { label: string; href: string; show: boolean }[] = [
    { label: 'Overview', href: `/${teamSlug}`, show: false },
    { label: 'Players', href: `/${teamSlug}/players`, show: true },
    {
      label: 'Standings',
      href: `/${teamSlug}/standings`,
      show: config?.hasStandings ?? false,
    },
    { label: 'Results', href: `/${teamSlug}/results`, show: config?.hasResults ?? false },
    { label: 'Fixtures', href: `/${teamSlug}/fixtures`, show: config?.hasFixtures ?? false },
    {
      label: 'Performance',
      href: `/${teamSlug}/performance`,
      show: config?.hasPerformance ?? false,
    },
  ];

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {tabs
          .filter((t) => t.show)
          .map((tab) => {
            const active =
              tab.href === `/${teamSlug}`
                ? pathname === tab.href
                : pathname === tab.href ||
                  (tab.label === 'Players' &&
                    pathname.startsWith(`/${teamSlug}/players/`));
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={cn(
                  'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  active
                    ? 'border-club-green-600 text-club-green-700'
                    : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900',
                )}
              >
                {tab.label}
              </Link>
            );
          })}
      </div>
    </nav>
  );
}
