import type { Metadata } from 'next';
import { getTeams, getRegistrations } from '@/lib/data';
import { formatMoney } from '@/lib/utils';
import { RegistrationForm } from '@/components/admin/registration-form';

export const metadata: Metadata = { title: 'Player Registration' };

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default async function AdminPlayersPage() {
  const [teams, registrations] = await Promise.all([getTeams(), getRegistrations()]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Player Registration</h2>
        <p className="mt-1 text-sm text-slate-500">
          Register players with the club. Add the team, position, date of birth and registration
          fee.
        </p>
      </section>

      <RegistrationForm teams={teams} />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Registered players ({registrations.length})
        </h3>
        {registrations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No registrations yet. Use the form above to register a player.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Player</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Team</th>
                  <th className="hidden px-4 py-3 md:table-cell">Position</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Registered</th>
                  <th className="px-4 py-3">Fee</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {registrations.map((r) => {
                  const team = teams.find((t) => t.id === r.team_id);
                  return (
                    <tr key={r.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{r.player_name}</td>
                      <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                        {team?.name ?? '—'}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                        {r.position ?? '—'}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                        {r.registration_date}
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatMoney(r.fee_amount)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[r.status] ?? 'bg-slate-100 text-slate-600'}`}
                        >
                          {r.status}
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