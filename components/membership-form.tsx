'use client';

import { useActionState } from 'react';
import { submitMembership, type FanActionResult } from '@/app/actions';
import { Field, TextInput, SelectInput, SubmitButton } from '@/components/admin/form';
import { PaymentForm } from '@/components/payment-form';
import { formatMoney } from '@/lib/utils';
import { MEMBERSHIP_TIERS, type SiteSettings } from '@/types';

export function MembershipForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<FanActionResult | null, FormData>(
    submitMembership,
    null,
  );

  const paidPending = state?.success && state.payment;

  if (paidPending) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-green-600">{state!.message}</p>
        <PaymentForm payment={state!.payment!} settings={settings} />
        <p className="text-center text-xs text-slate-400">
          By joining you agree to receive Ekhaya FC club updates. Your details are used
          only for club communications and are never shared.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="ekhaya-card p-5"
    >
      <h3 className="font-display mb-4 text-xl font-semibold uppercase tracking-wide text-club-ink">Join Ekhaya FC</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name *" className="sm:col-span-2">
          <TextInput name="full_name" required placeholder="Your name" />
        </Field>
        <Field label="Email *">
          <TextInput name="email" type="email" required placeholder="you@example.com" />
        </Field>
        <Field label="Phone">
          <TextInput name="phone" placeholder="+265 …" />
        </Field>
        <Field label="Membership type *" className="sm:col-span-2">
          <SelectInput name="member_type" required defaultValue="supporter">
            {MEMBERSHIP_TIERS.map((tier) => (
              <option key={tier.slug} value={tier.slug}>
                {tier.name} —{' '}
                {tier.priceValue && tier.priceValue > 0
                  ? formatMoney(tier.priceValue)
                  : tier.price}
              </option>
            ))}
          </SelectInput>
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Become a member" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}