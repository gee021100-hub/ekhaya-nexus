'use client';

import { useActionState } from 'react';
import { bookTickets, type FanActionResult } from '@/app/actions';
import { Field, TextInput, SubmitButton } from '@/components/admin/form';
import { PaymentForm } from '@/components/payment-form';
import type { SiteSettings, TicketAllocation } from '@/types';

export function TicketBookingForm({
  allocation,
  settings,
}: {
  allocation: TicketAllocation;
  settings: SiteSettings;
}) {
  const [state, action, pending] = useActionState<FanActionResult | null, FormData>(
    bookTickets,
    null,
  );

  const remaining =
    (allocation.capacity ?? 0) - (allocation.sold ?? 0);
  const available = allocation.status === 'available' && remaining > 0;

  const paidPending = state?.success && state.payment;

  return (
    <div className="ekhaya-card p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="font-display text-xl font-semibold uppercase tracking-wide text-club-ink">{allocation.category}</p>
          <p className="mt-1 text-sm text-[#8a8a8a]">
            {allocation.price === null || allocation.price === 0
              ? 'Price to be confirmed'
              : `MK ${Number(allocation.price).toLocaleString('en-MW')} per ticket`}
          </p>
        </div>
        {allocation.status === 'sold_out' || remaining <= 0 ? (
          <span className="rounded-full bg-[#FBE7E5] px-2.5 py-0.5 text-xs font-semibold text-[#c0392b]">
            Sold out
          </span>
        ) : (
          <span className="rounded-full bg-club-gold-100 px-2.5 py-0.5 text-xs font-semibold text-club-gold-700">
            {remaining} left
          </span>
        )}
      </div>

      {paidPending ? (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-green-600">{state!.message}</p>
          <PaymentForm payment={state!.payment!} settings={settings} />
        </div>
      ) : available ? (
        <form action={action} className="mt-4 grid gap-3">
          <Field label="Full name *">
            <TextInput name="full_name" required placeholder="Your name" />
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Email *">
              <TextInput name="email" type="email" required placeholder="you@example.com" />
            </Field>
            <Field label="Phone">
              <TextInput name="phone" placeholder="+265 …" />
            </Field>
          </div>
          <Field label="Tickets">
            <TextInput name="quantity" type="number" min="1" max={Math.max(remaining, 1)} defaultValue="1" />
          </Field>
          <input type="hidden" name="allocation_id" value={allocation.id} />
          <div className="flex items-center gap-3">
            <SubmitButton pending={pending} label="Book tickets" />
            {state && (
              <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                {state.message}
              </p>
            )}
          </div>
        </form>
      ) : (
        <p className="mt-4 text-sm text-slate-500">
          {allocation.status === 'cancelled'
            ? 'This allocation has been cancelled.'
            : 'No tickets left for this stand at the moment.'}
        </p>
      )}
    </div>
  );
}