'use client';

import { useTransition } from 'react';
import { deleteFanPoll, toggleFanPoll } from '@/app/admin/actions';
import type { FanPoll, PollVoteRow } from '@/types';

export function PollManager({
  polls,
  results,
}: {
  polls: FanPoll[];
  results: Record<string, PollVoteRow[]>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <section>
      <h3 className="mb-4 text-lg font-bold text-slate-900">Polls ({polls.length})</h3>
      {polls.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No polls yet. Publish your first fan poll above.
        </div>
      ) : (
        <div className="grid gap-4">
          {polls.map((poll) => {
            const votes = results[poll.id] ?? [];
            const total = votes.reduce((n, r) => n + r.votes, 0);
            return (
              <div key={poll.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-club-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-club-ink">
                        {poll.category}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                          poll.active ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {poll.active ? 'Open' : 'Closed'}
                      </span>
                      {poll.featured_match && (
                        <span className="text-xs text-slate-500">{poll.featured_match}</span>
                      )}
                    </div>
                    <p className="mt-1.5 font-bold text-slate-900">{poll.question}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {poll.options.length} options · {total} vote{total === 1 ? '' : 's'}
                    </p>
                    <ul className="mt-2 space-y-1">
                      {votes.map((row) => {
                        const option = poll.options.find((o) => o.id === row.option_id);
                        const pct = total > 0 ? Math.round((row.votes / total) * 100) : 0;
                        return (
                          <li key={row.option_id} className="flex items-center gap-2 text-sm">
                            <span className="flex-1 text-slate-700">
                              {option?.text ?? row.option_id}
                            </span>
                            <span className="text-xs text-slate-400">{row.votes}</span>
                            <span className="w-12 text-right text-xs font-semibold">{pct}%</span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => startTransition(() => void toggleFanPoll(poll.id, !poll.active))}
                      className="rounded-md border border-slate-300 px-2.5 py-1 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                    >
                      {poll.active ? 'Close' : 'Reopen'}
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => {
                        if (window.confirm(`Delete this poll and its votes?`)) {
                          startTransition(() => void deleteFanPoll(poll.id));
                        }
                      }}
                      className="rounded-md border border-red-200 px-2.5 py-1 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}