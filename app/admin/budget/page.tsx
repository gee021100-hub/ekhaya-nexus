import type { Metadata } from 'next';
import { getWeeklyBudgets } from '@/lib/data';
import { formatMoney } from '@/lib/utils';
import { BudgetForm } from '@/components/admin/budget-form';

export const metadata: Metadata = { title: 'Weekly Budget' };

const statusStyles: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-700',
  approved: 'bg-green-100 text-green-800',
  paid: 'bg-blue-100 text-blue-800',
};

export default async function AdminBudgetPage() {
  const budgets = await getWeeklyBudgets();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Weekly Budget Preparation</h2>
        <p className="mt-1 text-sm text-slate-500">
          Create a weekly budget, then add line items for each spending category.
        </p>
      </section>

      <BudgetForm budgets={budgets} />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Weekly budgets ({budgets.length})
        </h3>
        {budgets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No budgets created yet. Use the form above to start the weekly budget.
          </div>
        ) : (
          <div className="grid gap-4">
            {budgets.map((budget) => {
              const planned = (budget.items ?? []).reduce(
                (sum, item) => sum + (item.planned_amount ?? 0),
                0,
              );
              const actual = (budget.items ?? []).reduce(
                (sum, item) => sum + (item.actual_amount ?? 0),
                0,
              );
              return (
                <div
                  key={budget.id}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-bold text-slate-900">
                        {budget.week_start} → {budget.week_end}
                      </p>
                      {budget.notes && (
                        <p className="mt-0.5 text-sm text-slate-500">{budget.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-slate-500">
                        Planned: <strong className="text-slate-900">{formatMoney(planned)}</strong>
                      </span>
                      <span className="text-slate-500">
                        Actual: <strong className="text-slate-900">{formatMoney(actual)}</strong>
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${statusStyles[budget.status] ?? 'bg-slate-100 text-slate-600'}`}
                      >
                        {budget.status}
                      </span>
                    </div>
                  </div>
                  {(budget.items ?? []).length > 0 && (
                    <table className="mt-3 w-full text-left text-sm">
                      <thead className="text-xs uppercase tracking-wide text-slate-500">
                        <tr className="border-t border-slate-100">
                          <th className="py-2 pr-4">Category</th>
                          <th className="hidden py-2 pr-4 sm:table-cell">Description</th>
                          <th className="py-2 pr-4">Planned</th>
                          <th className="py-2">Actual</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(budget.items ?? []).map((item) => (
                          <tr key={item.id}>
                            <td className="py-2 pr-4 font-medium text-slate-800">{item.category}</td>
                            <td className="hidden py-2 pr-4 text-slate-500 sm:table-cell">
                              {item.description ?? '—'}
                            </td>
                            <td className="py-2 pr-4 text-slate-600">
                              {formatMoney(item.planned_amount)}
                            </td>
                            <td className="py-2 text-slate-600">
                              {formatMoney(item.actual_amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}