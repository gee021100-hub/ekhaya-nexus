'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  { label: 'Dashboard', href: '/admin', match: /^\/admin$/ },
  { label: 'Players', href: '/admin/players', match: /^\/admin\/players/ },
  { label: 'Transfers', href: '/admin/transfers', match: /^\/admin\/transfers/ },
  { label: 'Budget', href: '/admin/budget', match: /^\/admin\/budget/ },
  { label: 'Petty Cash', href: '/admin/petty-cash', match: /^\/admin\/petty-cash/ },
  { label: 'Staff', href: '/admin/staff', match: /^\/admin\/staff/ },
  { label: 'Training', href: '/admin/training', match: /^\/admin\/training/ },
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