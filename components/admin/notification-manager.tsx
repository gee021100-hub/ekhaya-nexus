'use client';

import { useTransition } from 'react';
import { deleteFanNotification } from '@/app/admin/actions';
import { NOTIFICATION_CATEGORY_LABELS } from '@/types';
import type { FanNotification } from '@/types';

export function NotificationManager({ notifications }: { notifications: FanNotification[] }) {
  const [isPending, startTransition] = useTransition();

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold text-slate-900">
        Broadcasts ({notifications.length})
      </h3>
      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No notifications sent yet. Broadcasts appear in the bell tray on every page.
        </div>
      ) : (
        <div className="grid gap-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-club-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-club-ink">
                      {NOTIFICATION_CATEGORY_LABELS[notification.category] ?? notification.category}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                        notification.enabled ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {notification.enabled ? 'Live' : 'Hidden'}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(notification.published_at).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="mt-1.5 font-bold text-slate-900">{notification.title}</p>
                  <p className="mt-0.5 text-sm text-slate-600">{notification.message}</p>
                </div>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (window.confirm(`Delete "${notification.title}"?`)) {
                      startTransition(() => void deleteFanNotification(notification.id));
                    }
                  }}
                  className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}