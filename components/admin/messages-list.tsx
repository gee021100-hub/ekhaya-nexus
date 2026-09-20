'use client';

import { useTransition } from 'react';
import { markContactMessage } from '@/app/admin/actions';
import type { ContactMessage } from '@/types';

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function MessagesList({ messages }: { messages: ContactMessage[] }) {
  const [pending, start] = useTransition();

  const setStatus = (id: string, status: 'new' | 'read' | 'archived') => {
    start(() => {
      void markContactMessage(id, status);
    });
  };

  const badge = (status: string) =>
    status === 'new'
      ? 'bg-club-gold-100 text-club-gold-800'
      : status === 'read'
        ? 'bg-slate-100 text-slate-600'
        : 'bg-slate-100 text-slate-400';

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <article
          key={message.id}
          className={`rounded-2xl border bg-white p-5 shadow-sm ${
            message.status === 'new' ? 'border-club-gold-300 ring-1 ring-club-gold-100' : 'border-slate-200'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-900">{message.subject || 'No subject'}</h3>
              <p className="mt-0.5 text-sm text-slate-500">
                {message.name} · {message.email}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${badge(message.status)}`}>
                {message.status}
              </span>
              <span className="text-xs text-slate-400">{formatDate(message.created_at)}</span>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{message.message}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {message.status !== 'read' && (
              <button
                type="button"
                disabled={pending}
                onClick={() => setStatus(message.id, 'read')}
                className="rounded-lg border border-club-gold-300 px-3 py-1.5 text-sm font-semibold text-club-gold-800 transition-colors hover:bg-club-gold-100 disabled:opacity-60"
              >
                Mark as read
              </button>
            )}
            {message.status !== 'archived' && (
              <button
                type="button"
                disabled={pending}
                onClick={() => setStatus(message.id, 'archived')}
                className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 disabled:opacity-60"
              >
                Archive
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}