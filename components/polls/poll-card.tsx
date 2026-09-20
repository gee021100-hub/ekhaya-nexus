'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTransition } from 'react';
import { castFanVote } from '@/app/actions';
import type { FanPoll, PollVoteRow } from '@/types';

type VoteState = { optionId: string; results: PollVoteRow[] };

function visitorId(): string {
  if (typeof window === 'undefined') return '';
  const key = 'ekhaya-visitor';
  let id = window.localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    window.localStorage.setItem(key, id);
  }
  return id;
}

function formatTotal(results: PollVoteRow[]): number {
  return results.reduce((n, r) => n + r.votes, 0);
}

export function PollCard({ poll, initialResults }: { poll: FanPoll; initialResults: PollVoteRow[] }) {
  const [vote, setVote] = useState<VoteState | null>(
    initialResults.length > 0 ? { optionId: '', results: initialResults } : null,
  );
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [isPending, startTransition] = useTransition();

  const refreshResults = useCallback(async () => {
    try {
      const res = await fetch(`/api/polls/${poll.id}`);
      const data = (await res.json()) as { results?: PollVoteRow[] };
      if (data.results) {
        setVote((prev) => ({ optionId: prev?.optionId ?? '', results: data.results ?? [] }));
      }
    } catch {
      // Keep current results if the refresh fails.
    }
  }, [poll.id]);

  useEffect(() => {
    if (vote?.optionId) refreshResults();
  }, [vote, refreshResults]);

  function handleVote(optionId: string) {
    setError(null);
    setMessage(null);
    startTransition(async () => {
      const form = new FormData();
      form.set('poll_id', poll.id);
      form.set('option_id', optionId);
      form.set('visitor', visitorId());
      const result = await castFanVote(null, form);
      if (result.success && result.results) {
        setVote({ optionId, results: result.results });
        setPoints(result.points ?? 0);
        setMessage(result.message);
      } else {
        setVote((prev) => ({ optionId: prev?.optionId ?? '', results: prev?.results ?? initialResults }));
        if (result.message?.toLowerCase().includes('already')) {
          setError('You have already voted in this poll.');
          void refreshResults();
        } else {
          setError(result.message ?? 'Could not record your vote.');
        }
      }
    });
  }

  const total = formatTotal(vote?.results ?? initialResults);
  const votedFor = vote?.optionId ?? '';
  const hasResults = (vote?.results.length ?? 0) > 0;

  return (
    <article className="ekhaya-card p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-club-gold px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-club-ink">
            {poll.category}
          </span>
          {!poll.active && (
            <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-slate-600">
              Closed
            </span>
          )}
          {poll.featured_match && (
            <span className="rounded-full border border-club-border px-2.5 py-0.5 text-[11px] font-semibold text-[#8a8a8a]">
              {poll.featured_match}
            </span>
          )}
        </div>
        {total > 0 && (
          <span className="text-xs font-medium text-[#8a8a8a]">
            {total} vote{total === 1 ? '' : 's'}
          </span>
        )}
      </div>

      <h2 className="font-display mt-3 text-xl font-semibold uppercase tracking-wide text-club-ink">
        {poll.question}
      </h2>
      {poll.description && <p className="mt-1 text-sm text-slate-600">{poll.description}</p>}

      {poll.active && !votedFor ? (
        <>
          <div className="mt-4 grid gap-2">
            {poll.options.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={isPending}
                onClick={() => handleVote(option.id)}
                className="rounded-xl border border-club-border bg-white px-4 py-2.5 text-left text-sm font-medium text-[#3d3d3d] transition-all hover:border-club-gold hover:bg-club-gold-50 disabled:opacity-50"
              >
                {option.text}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-slate-500">
            One vote per device — earn{' '}
            <span className="font-semibold text-club-gold-700">+5 Khaya points</span> for joining in.
          </p>
        </>
      ) : (
        <>
          <ul className="mt-4 grid gap-2">
            {poll.options.map((option) => {
              const row = (vote?.results ?? []).find((r) => r.option_id === option.id);
              const votes = row?.votes ?? 0;
              const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
              const isChosen = votedFor === option.id;
              return (
                <li key={option.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className={`font-medium ${isChosen ? 'text-club-gold-700' : 'text-[#3d3d3d]'}`}>
                      {option.text}
                      {isChosen && <span className="ml-1">✓</span>}
                    </span>
                    <span className="text-xs text-[#8a8a8a]">
                      {pct}% · {votes}
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#f0e9d8]">
                    <div
                      className={`h-full rounded-full ${isChosen ? 'bg-club-gold' : 'bg-club-gold/60'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
          {(votedFor || hasResults) && (
            <p className="mt-3 text-xs text-slate-500">
              {votedFor ? `Your vote has been counted.` : 'Live results from Ekhaya fans.'}{' '}
              {points > 0 && (
                <span className="font-semibold text-club-gold-700">+{points} Khaya points earned.</span>
              )}
            </p>
          )}
        </>
      )}

      {error && (
        <p className="mt-3 rounded-lg bg-red-50 p-2 text-sm text-red-700">{error}</p>
      )}
      {message && (
        <p className="mt-3 rounded-lg bg-club-gold-50 p-2 text-sm text-club-gold-800">{message}</p>
      )}

      {poll.ends_at && (
        <p className="mt-3 text-xs text-[#8a8a8a]">
          Closes {new Date(poll.ends_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
        </p>
      )}
    </article>
  );
}