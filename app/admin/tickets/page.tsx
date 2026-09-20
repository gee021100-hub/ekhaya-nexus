import type { Metadata } from 'next';
import { getTicketAllocations, getTeamBySlug, getFixtures } from '@/lib/data';
import { formatMoney } from '@/lib/utils';
import { TicketForm } from '@/components/admin/ticket-form';

export const metadata: Metadata = { title: 'Match Tickets' };

const statusStyles: Record<string, string> = {
  available: 'bg-green-100 text-green-800',
  sold_out: 'bg-red-100 text-red-800',
  cancelled: 'bg-slate-100 text-slate-600',
};

export default async function AdminTicketsPage() {
  const [allocations, seniorTeam] = await Promise.all([
    getTicketAllocations(),
    getTeamBySlug('senior'),
  ]);

  const fixtures = seniorTeam ? await getFixtures(seniorTeam.id) : [];

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Match Tickets</h2>
        <p className="mt-1 text-sm text-slate-500">
          Open ticket sales for a fixture by creating allocations per stand category.
        </p>
      </section>

      <TicketForm fixtures={fixtures} />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Ticket allocations ({allocations.length})</h3>
        {allocations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No ticket allocations yet. Choose a fixture and create a stand to open sales.
          </div>
        ) : (
          <div className="grid gap-4">
            {allocations.map((allocation) => {
              const sold = allocation.sold ?? 0;
              const capacity = allocation.capacity ?? 0;
              return (
                <div key={allocation.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900">
                        {allocation.fixture_name ?? 'General admission'}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {allocation.category} · {formatMoney(allocation.price)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">
                        Sold: <strong className="text-slate-900">{sold}</strong> / {capacity}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[allocation.status] ?? 'bg-slate-100 text-slate-600'}`}
                      >
                        {allocation.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}