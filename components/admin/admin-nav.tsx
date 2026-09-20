'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  { label: 'Dashboard', href: '/admin', match: /^\/admin$/ },
  { label: 'Analytics', href: '/admin/analytics', match: /^\/admin\/analytics/ },
  { label: 'Reports', href: '/admin/reports', match: /^\/admin\/reports/ },
  { label: 'Players', href: '/admin/players', match: /^\/admin\/players/ },
  { label: 'Transfers', href: '/admin/transfers', match: /^\/admin\/transfers/ },
  { label: 'Budget', href: '/admin/budget', match: /^\/admin\/budget/ },
  { label: 'Petty Cash', href: '/admin/petty-cash', match: /^\/admin\/petty-cash/ },
  { label: 'Staff', href: '/admin/staff', match: /^\/admin\/staff/ },
  { label: 'Training', href: '/admin/training', match: /^\/admin\/training/ },
  { label: 'News', href: '/admin/news', match: /^\/admin\/news/ },
  { label: 'Media', href: '/admin/media', match: /^\/admin\/media/ },
  { label: 'Tickets', href: '/admin/tickets', match: /^\/admin\/tickets/ },
  { label: 'Store', href: '/admin/store', match: /^\/admin\/store/ },
  { label: 'Polls', href: '/admin/polls', match: /^\/admin\/polls/ },
  { label: 'Notifications', href: '/admin/notifications', match: /^\/admin\/notifications/ },
  { label: 'Payments', href: '/admin/payments', match: /^\/admin\/payments/ },
  { label: 'Announcements', href: '/admin/announcements', match: /^\/admin\/announcements/ },
  { label: 'Sponsors', href: '/admin/sponsors', match: /^\/admin\/sponsors/ },
  { label: 'Messages', href: '/admin/messages', match: /^\/admin\/messages/ },
  { label: 'Settings', href: '/admin/settings', match: /^\/admin\/settings/ },
];

export function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6 lg:px-8">
        {items.map((item) => {
          const active = item.match.test(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                active
                  ? 'border-club-gold-500 text-club-gold-700'
                  : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-900',
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}