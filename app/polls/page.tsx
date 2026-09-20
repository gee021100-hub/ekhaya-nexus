import type { Metadata } from 'next';
import { getFanPolls, getPollResults } from '@/lib/data';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';
import { PollCard } from '@/components/polls/poll-card';

export const metadata: Metadata = { title: 'Fan Engagement' };

export default async function PollsPage() {
  const polls = await getFanPolls();
  const active = polls.filter((p) => p.active);
  const past = polls.filter((p) => !p.active).slice(0, 6);

  const results = new Map<string, Awaited<ReturnType<typeof getPollResults>>>();
  await Promise.all(
    polls.map(async (poll) => results.set(poll.id, await getPollResults(poll.id))),
  );

  const renderPoll = (poll: (typeof polls)[number]) => (
    <PollCard poll={poll} initialResults={results.get(poll.id) ?? []} />
  );

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Fan Engagement"
        subtitle="Have your say — predict results, pick your player of the week and earn Khaya points with every vote."
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {polls.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-club-border bg-white p-14 text-center">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">
              Polls are coming soon
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Ekhaya FC fans will get to predict results and pick players of the week here.
              Check back after the next match.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <section>
              <h2 className="font-display mb-4 text-2xl font-semibold uppercase tracking-wide text-club-ink">
                Vote now
              </h2>
              {active.length === 0 ? (
                <p className="text-sm text-slate-500">No open polls right now — check back soon.</p>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">{active.map(renderPoll)}</div>
              )}
            </section>

            {past.length > 0 && (
              <section>
                <h2 className="font-display mb-4 text-2xl font-semibold uppercase tracking-wide text-club-ink">
                  Previous polls
                </h2>
                <div className="grid gap-6 md:grid-cols-2">{past.map(renderPoll)}</div>
              </section>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}