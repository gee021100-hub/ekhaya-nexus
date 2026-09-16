import type { Metadata } from 'next';
import { getTeams, getTrainingAllocations } from '@/lib/data';
import { formatMoney } from '@/lib/utils';
import { TrainingForm } from '@/components/admin/training-form';

export const metadata: Metadata = { title: 'Training Allocation' };

const statusStyles: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default async function AdminTrainingPage() {
  const [teams, allocations] = await Promise.all([getTeams(), getTrainingAllocations()]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Training Allocation</h2>
        <p className="mt-1 text-sm text-slate-500">
          Schedule training sessions per team with location, session type, size and budget.
        </p>
      </section>

      <TrainingForm teams={teams} />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Training sessions ({allocations.length})
        </h3>
        {allocations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No training allocations yet. Use the form above to schedule a session.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Team</th>
                  <th className="hidden px-4 py-3 md:table-cell">Session</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Location</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Players</th>
                  <th className="px-4 py-3">Budget</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allocations.map((a) => {
                  const team = teams.find((t) => t.id === a.team_id);
                  return (
                    <tr key={a.id}>
                      <td className="px-4 py-3 text-slate-600">{a.training_date}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {team?.name ?? '—'}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                        {a.session_type ?? '—'}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                        {a.location ?? '—'}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                        {a.players_invited ?? '—'}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatMoney(a.budget_amount)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[a.status] ?? 'bg-slate-100 text-slate-600'}`}
                        >
                          {a.status}
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