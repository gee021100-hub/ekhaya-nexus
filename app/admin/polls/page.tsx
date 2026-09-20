import type { Metadata } from 'next';
import { getFanPolls, getPollResults } from '@/lib/data';
import { PollForm } from '@/components/admin/poll-form';
import { PollManager } from '@/components/admin/poll-manager';

export const metadata: Metadata = { title: 'Fan Engagement' };

export default async function AdminPollsPage() {
  const polls = await getFanPolls();

  const results: Record<string, Awaited<ReturnType<typeof getPollResults>>> = {};
  await Promise.all(
    polls.map(async (poll) => {
      results[poll.id] = await getPollResults(poll.id);
    }),
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Fan Engagement</h2>
        <p className="mt-1 text-sm text-slate-500">
          Publish polls for fans — match predictions, player of the week and more. One vote per device.
        </p>
      </section>

      <PollForm />
      <PollManager polls={polls} results={results} />
    </div>
  );
}