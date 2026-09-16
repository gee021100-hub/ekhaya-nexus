import type { Metadata } from 'next';
import { getTeams, getStaffAllowances } from '@/lib/data';
import { formatMoney } from '@/lib/utils';
import { StaffAllowanceForm } from '@/components/admin/staff-form';

export const metadata: Metadata = { title: 'Staff Allowance' };

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  paid: 'bg-green-100 text-green-800',
};

export default async function AdminStaffPage() {
  const [teams, allowances] = await Promise.all([getTeams(), getStaffAllowances()]);

  const total = allowances.reduce((sum, a) => sum + (a.amount ?? 0), 0);

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Staff Allowance</h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage allowance payments for coaches, medical and support staff.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Total allowances</p>
          <p className="mt-1 text-2xl font-black text-club-green-700">{formatMoney(total)}</p>
        </div>
      </section>

      <StaffAllowanceForm teams={teams} />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Allowance records ({allowances.length})
        </h3>
        {allowances.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No allowances recorded yet. Use the form above to add one.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Staff</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Role</th>
                  <th className="hidden px-4 py-3 md:table-cell">Team</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Period</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allowances.map((a) => {
                  const team = a.team_id ? teams.find((t) => t.id === a.team_id) : null;
                  return (
                    <tr key={a.id}>
                      <td className="px-4 py-3 font-medium text-slate-900">{a.staff_name}</td>
                      <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                        {a.role ?? '—'}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                        {team?.name ?? 'All teams'}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                        {a.period_start} → {a.period_end}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-900">
                        {formatMoney(a.amount)}
                      </td>
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