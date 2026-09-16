import type { Metadata } from 'next';
import { getPettyCashTransactions } from '@/lib/data';
import { formatMoney } from '@/lib/utils';
import { PettyCashForm } from '@/components/admin/petty-cash-form';

export const metadata: Metadata = { title: 'Petty Cash' };

export default async function AdminPettyCashPage() {
  const transactions = await getPettyCashTransactions();

  const cashIn = transactions
    .filter((t) => t.transaction_type === 'in')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const cashOut = transactions
    .filter((t) => t.transaction_type === 'out')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const balance = cashIn - cashOut;

  return (
    <div className="space-y-8">
      <section className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Petty Cash</h2>
          <p className="mt-1 text-sm text-slate-500">
            Track small cash inflows and outflows for the club.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-slate-500">Current balance</p>
          <p
            className={`mt-1 text-2xl font-black ${balance >= 0 ? 'text-club-green-700' : 'text-red-600'}`}
          >
            {formatMoney(balance)}
          </p>
          <div className="mt-1 flex gap-4 text-xs text-slate-500">
            <span>
              In: <strong className="text-green-700">{formatMoney(cashIn)}</strong>
            </span>
            <span>
              Out: <strong className="text-red-700">{formatMoney(cashOut)}</strong>
            </span>
          </div>
        </div>
      </section>

      <PettyCashForm />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Transactions ({transactions.length})
        </h3>
        {transactions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No petty cash entries yet. Use the form above to add one.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Category</th>
                  <th className="hidden px-4 py-3 md:table-cell">Requestor</th>
                  <th className="px-4 py-3">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-3 text-slate-600">{t.transaction_date}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">{t.description}</td>
                    <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                      {t.category ?? '—'}
                    </td>
                    <td className="hidden px-4 py-3 text-slate-600 md:table-cell">
                      {t.requestor ?? '—'}
                    </td>
                    <td
                      className={`px-4 py-3 font-semibold ${t.transaction_type === 'out' ? 'text-red-600' : 'text-green-700'}`}
                    >
                      {t.transaction_type === 'out' ? '−' : '+'}
                      {formatMoney(t.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}