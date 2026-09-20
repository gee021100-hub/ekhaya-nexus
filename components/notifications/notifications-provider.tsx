'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface TrayNotification {
  id: string;
  title: string;
  message: string;
  category: string;
  published_at: string;
}

type NotificationsValue = {
  notifications: TrayNotification[];
  unreadCount: number;
  isOpen: boolean;
  toggle: () => void;
  close: () => void;
  markAllRead: () => void;
};

const SEEN_KEY = 'ekhaya-notifications-seen.v1';

const NotificationsContext = createContext<NotificationsValue | null>(null);

const CATEGORY_LABELS: Record<string, string> = {
  match: 'Match day',
  news: 'Club news',
  ticket: 'Tickets',
  store: 'Store',
  admin: 'Club admin',
};

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<TrayNotification[]>([]);
  const [seenIds, setSeenIds] = useState<Set<string>>(new Set());
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SEEN_KEY);
      if (raw) setSeenIds(new Set(JSON.parse(raw) as string[]));
    } catch {
      // Ignore corrupt storage.
    }
    setHydrated(true);
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const data = (await res.json()) as { notifications?: TrayNotification[] };
      setNotifications(data.notifications ?? []);
    } catch {
      // Tray stays empty if the feed is unreachable.
    }
  }, []);

  useEffect(() => {
    load();
    const timer = window.setInterval(load, 60_000);
    return () => window.clearInterval(timer);
  }, [load]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(SEEN_KEY, JSON.stringify([...seenIds]));
    } catch {
      // Storage unavailable.
    }
  }, [seenIds, hydrated]);

  const unreadCount = notifications.filter((n) => !seenIds.has(n.id)).length;

  const markAllRead = useCallback(() => {
    setSeenIds(new Set(notifications.map((n) => n.id)));
  }, [notifications]);

  const value = useMemo<NotificationsValue>(
    () => ({
      notifications,
      unreadCount,
      isOpen,
      toggle: () => setIsOpen((open) => !open),
      close: () => setIsOpen(false),
      markAllRead,
    }),
    [notifications, unreadCount, isOpen, markAllRead],
  );

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
}

export function useNotifications(): NotificationsValue {
  const value = useContext(NotificationsContext);
  if (!value) throw new Error('useNotifications must be used within a NotificationsProvider');
  return value;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const diff = Date.now() - then;
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function NotificationsBell() {
  const { notifications, unreadCount, isOpen, toggle, close, markAllRead } = useNotifications();

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="relative rounded-lg border border-club-border px-3 py-1.5 text-sm font-semibold text-[#3d3d3d] transition-all hover:bg-club-gold-100"
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : 'Notifications'}
      >
        <span className="text-lg leading-none" aria-hidden="true">
          🔔
        </span>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-club-gold px-1 text-[10px] font-bold text-club-ink">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 cursor-default"
            onClick={close}
            aria-label="Close notifications"
            tabIndex={-1}
          />
          <aside className="absolute right-0 top-full z-50 mt-2 flex max-h-[70vh] w-80 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl border border-club-border bg-white shadow-xl">
            <header className="flex items-center justify-between border-b border-club-border px-4 py-3">
              <h2 className="font-display text-base font-semibold uppercase tracking-wide text-club-ink">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-xs font-semibold text-club-gold-800 hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </header>
            <div className="overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="p-6 text-center text-sm text-slate-500">
                  No club announcements right now.
                </p>
              ) : (
                <ul className="divide-y divide-club-border">
                  {notifications.map((n) => (
                    <li key={n.id} className="px-4 py-3">
                      <div className="flex items-center justify-between gap-2">
                        <span className="rounded-full bg-club-gold-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-club-gold-800">
                          {CATEGORY_LABELS[n.category] ?? n.category}
                        </span>
                        <span className="text-[11px] text-[#8a8a8a]">{timeAgo(n.published_at)}</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold text-club-ink">{n.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{n.message}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </>
      )}
    </>
  );
}