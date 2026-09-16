import type { Metadata } from 'next';
import { getTeams, getTransfers } from '@/lib/data';
import { formatMoney } from '@/lib/utils';
import { TransferForm } from '@/components/admin/transfer-form';

export const metadata: Metadata = { title: 'Transfers' };

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default async function AdminTransfersPage() {
  const [teams, transfers] = await Promise.all([getTeams(), getTransfers()]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Transfers</h2>
        <p className="mt-1 text-sm text-slate-500">
          Record incoming and outgoing player transfers with other clubs.
        </p>
      </section>

      <TransferForm teams={teams} />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Transfer records ({transfers.length})
        </h3>
        {transfers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No transfers recorded yet. Use the form above to record a transfer.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Player</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Team</th>
                  <th className="px-4 py-3">Type</th>
                  <th className="hidden px-4 py-3 md:table-cell">Club</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Date</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transfers.map((t) => {
                  const team = teams.find((x) => x.id === t.team_id);
                  return (
                    <tr key={t.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{t.player_name}</td>
                      <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                        {team?.name ?? '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${t.transfer_type === 'in' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                        >
                          {t.transfer_type === 'in' ? 'In' : 'Out'}
                        </span>
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                        {t.other_club}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                        {t.transfer_date}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatMoney(t.fee_amount)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[t.status] ?? 'bg-slate-100 text-slate-600'}`}
                        >
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}