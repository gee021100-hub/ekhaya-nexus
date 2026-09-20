'use client';

import { useActionState } from 'react';
import { submitPaymentReference, type FanActionResult, type FanPaymentInfo } from '@/app/actions';
import { Field, TextInput, SelectInput, SubmitButton } from '@/components/admin/form';
import { paymentInstructions, paymentModeNotice, paymentWallets } from '@/lib/payments';
import { formatMoney } from '@/lib/utils';
import type { SiteSettings } from '@/types';

export function PaymentForm({
  payment,
  settings,
}: {
  payment: FanPaymentInfo;
  settings: SiteSettings;
}) {
  const [state, action, pending] = useActionState<FanActionResult | null, FormData>(
    submitPaymentReference,
    null,
  );
  const wallets = paymentWallets(settings);
  const instructions = paymentInstructions(
    settings,
    'Pay the amount to the Ekhaya FC mobile-money wallet at the match-day ticket office or on club channels, then enter your reference below.',
  );

  return (
    <div className="rounded-2xl border border-club-gold bg-club-gold-50 p-5">
      <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-club-ink">Complete your payment</h3>

      <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <p className="font-display text-3xl font-semibold text-club-gold-700">
          {formatMoney(payment.amount)}
        </p>
        <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-semibold text-[#8a8a8a] border border-club-border">
          Quote {payment.reference || 'your payment reference'}
        </span>
      </div>

      {payment.mode === 'sandbox' ? (
        <p className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          {paymentModeNotice('sandbox')}
        </p>
      ) : (
        <p className="mt-3 text-sm text-slate-500">{paymentModeNotice('manual')}</p>
      )}

      {wallets.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-slate-700">
          {wallets.map((wallet) => (
            <li key={wallet.provider} className="flex items-center gap-2">
              <span className="font-semibold">{wallet.provider}:</span>
              <span className="font-black">{wallet.number}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-slate-500">{instructions}</p>
      )}

      <form action={action} className="mt-4 grid gap-3">
        <input type="hidden" name="transaction_id" value={payment.transactionId} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="You paid with">
            <SelectInput name="provider" defaultValue="mpamba">
              <option value="mpamba">Mpamba</option>
              <option value="airtel">Airtel Money</option>
            </SelectInput>
          </Field>
          <Field label="Your payment reference *">
            <TextInput
              name="provider_reference"
              required
              placeholder="e.g. RCP-123456789"
              autoComplete="off"
            />
          </Field>
        </div>
        <div className="flex items-center gap-3">
          <SubmitButton pending={pending} label="I have paid" pendingLabel="Verifying…" />
          {state && (
            <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
              {state.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}