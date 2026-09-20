'use client';

import { useActionState } from 'react';
import { cancelPayment, confirmPayment } from '@/app/admin/actions';
import { formatMoney } from '@/lib/utils';
import type { PaymentTransaction } from '@/types';

function formatDate(date: string | null): string {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-slate-100 text-slate-600',
};

export function PaymentsList({
  payments,
}: {
  payments: (PaymentTransaction & { description: string })[];
}) {
  const [confirmState, confirmAction, confirmPending] = useActionState(confirmPayment, null);
  const [cancelState, cancelAction, cancelPending] = useActionState(cancelPayment, null);

  return (
    <div className="space-y-4">
      {confirmState && (
        <p className={`text-sm ${confirmState.success ? 'text-green-600' : 'text-red-600'}`}>
          {confirmState.message}
        </p>
      )}
      {cancelState && (
        <p className={`text-sm ${cancelState.success ? 'text-green-600' : 'text-red-600'}`}>
          {cancelState.message}
        </p>
      )}

      {payments.map((payment) => (
        <article
          key={payment.id}
          className={`rounded-2xl border bg-white p-5 shadow-sm ${
            payment.status === 'pending'
              ? 'border-club-gold-300 ring-1 ring-club-gold-100'
              : 'border-slate-200'
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-slate-900">{formatMoney(payment.amount)}</h3>
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                  {payment.reference}
                </span>
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
                    statusStyles[payment.status] ?? 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {payment.status}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-700">
                {payment.customer_name || 'Fan'} · {payment.description}
                {payment.method === 'provider' && ' · paid via provider'}
              </p>
              <p className="text-xs text-slate-400">{formatDate(payment.created_at)}</p>
            </div>
            <div className="text-right text-sm text-slate-500">
              <p>
                {payment.customer_email || 'No email'}
                {payment.phone && ` · ${payment.phone}`}
              </p>
              {payment.provider && <p className="text-xs">{payment.provider}</p>}
              {payment.provider_reference && (
                <p className="text-xs text-slate-600">
                  Wallet ref: <span className="font-mono">{payment.provider_reference}</span>
                </p>
              )}
            </div>
          </div>

          {payment.status === 'pending' && (
            <div className="mt-4 flex flex-wrap gap-2">
              <form action={confirmAction}>
                <input type="hidden" name="transaction_id" value={payment.id} />
                <button
                  type="submit"
                  disabled={confirmPending}
                  className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
                >
                  Confirm payment received
                </button>
              </form>
              <form action={cancelAction}>
                <input type="hidden" name="transaction_id" value={payment.id} />
                <button
                  type="submit"
                  disabled={cancelPending}
                  className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
                >
                  Mark as failed
                </button>
              </form>
            </div>
          )}
        </article>
      ))}
    </div>
  );
}