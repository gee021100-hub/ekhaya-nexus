'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Brand } from '@/components/brand/logo';
import { useStoreCart } from '@/components/store/cart-context';
import { NotificationsBell } from '@/components/notifications/notifications-provider';
import {
  HomeIcon,
  LiveIcon,
  TicketIcon,
  HeartIcon,
  NewsIcon,
} from '@/components/brand/app-icons';

const items = [
  { label: 'Match Centre', href: '/match-centre' },
  { label: 'News', href: '/news' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Media', href: '/media' },
  { label: 'Tickets', href: '/tickets' },
  { label: 'Store', href: '/store' },
  { label: 'Fan Polls', href: '/polls' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const tabs = [
  { label: 'Home', href: '/', icon: HomeIcon },
  { label: 'Match Centre', href: '/match-centre', icon: LiveIcon },
  { label: 'Tickets', href: '/tickets', icon: TicketIcon },
  { label: 'Membership', href: '/membership', icon: HeartIcon },
  { label: 'News', href: '/news', icon: NewsIcon },
];

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function FanNav() {
  const pathname = usePathname();
  const { count, openDrawer } = useStoreCart();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-club-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90">
        <div className="h-0.5 bg-club-gold" />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Brand subtitle="Digital App" />
          <nav className="hidden items-center gap-1 lg:flex">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'whitespace-nowrap rounded-lg px-3.5 py-2 text-sm font-medium transition-all',
                  isActive(pathname, item.href)
                    ? 'bg-club-ink text-white shadow-sm'
                    : 'text-[#3d3d3d] hover:bg-club-gold-100 hover:text-club-gold-800',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <div className="relative">
              <NotificationsBell />
            </div>
            <button
              type="button"
              onClick={openDrawer}
              className="relative rounded-lg border border-club-border px-3 py-1.5 text-sm font-semibold text-[#3d3d3d] transition-all hover:bg-club-gold-100"
              aria-label={`Cart (${count} items)`}
            >
              Cart
              {count > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-club-gold px-1 text-[10px] font-bold text-club-ink">
                  {count}
                </span>
              )}
            </button>
            <Link href="/membership" className="btn-gold px-4 py-1.5 text-sm">
              Membership
            </Link>
            <Link
              href="/admin"
              className="rounded-lg border border-club-gold-300 px-3.5 py-1.5 text-sm font-semibold text-club-gold-800 transition-all hover:bg-club-gold-100 hover:shadow-sm"
            >
              Admin
            </Link>
          </div>
        </div>
        <nav className="-mx-4 hidden gap-1 overflow-x-auto px-4 pb-2.5 sm:-mx-0 sm:flex sm:px-6 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition-all',
                isActive(pathname, item.href)
                  ? 'bg-club-ink text-white shadow-sm'
                  : 'text-[#3d3d3d] hover:bg-club-gold-100 hover:text-club-gold-800',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>

      <nav className="app-tabbar sm:hidden" aria-label="App navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(isActive(pathname, tab.href) && 'active')}
            >
              <Icon />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}