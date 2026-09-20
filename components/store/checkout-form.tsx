'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useActionState } from 'react';
import { checkoutStoreOrder, type FanActionResult } from '@/app/actions';
import { useStoreCart } from '@/components/store/cart-context';
import { PaymentForm } from '@/components/payment-form';
import { Field, TextInput, SelectInput, SubmitButton } from '@/components/admin/form';
import { formatMoney } from '@/lib/utils';
import { DELIVERY_OPTION_LABELS, type SiteSettings } from '@/types';

export function CheckoutForm() {
  const { items, total, toCheckoutLines, clearCart } = useStoreCart();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [state, action, pending] = useActionState<FanActionResult | null, FormData>(
    checkoutStoreOrder,
    null,
  );

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => s && setSettings(s as SiteSettings))
      .catch(() => setSettings(null));
  }, []);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-dashed border-club-border bg-white p-10 text-center">
        <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">
          Your cart is empty
        </h2>
        <p className="mt-1 text-sm text-slate-500">Add something from the official store first.</p>
        <Link href="/store" className="btn-gold mt-5">
          Back to the store
        </Link>
      </div>
    );
  }

  if (state?.success) {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border border-club-gold bg-club-gold-50 p-6">
          <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">
            Order placed — {state.reference ?? 'Ekhaya store'}
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Thank you, Ekhaya fan. Your order has been received and is being prepared.
            {state.payment ? ' Complete your payment below to confirm it.' : ''}
          </p>
        </div>

        {state.payment && settings ? (
          <div className="mt-4">
            <PaymentForm payment={state.payment} settings={settings} />
          </div>
        ) : state.payment ? (
          <p className="mt-4 text-sm text-slate-500">
            Payment details could not be loaded — refresh to complete your payment with reference{' '}
            {state.payment.reference}.
          </p>
        ) : (
          <div className="mt-4 text-center">
            <Link href="/store" onClick={() => clearCart()} className="btn-gold">
              Continue shopping
            </Link>
          </div>
        )}
      </div>
    );
  }

  const lines = toCheckoutLines();

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <div className="ekhaya-card p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-club-ink">
            Your details
          </h2>
          <form action={action} className="mt-4 grid gap-3">
            <input type="hidden" name="items" value={JSON.stringify(lines)} />
            {/* Honeypot — hidden from real users */}
            <input
              type="text"
              name="website"
              value=""
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />
            <Field label="Full name *">
              <TextInput name="full_name" required autoComplete="name" placeholder="Your full name" />
            </Field>
            <Field label="Email address *">
              <TextInput
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Phone number">
              <TextInput
                name="phone"
                autoComplete="tel"
                placeholder="+265 …"
              />
            </Field>
            <Field label="Collection option">
              <SelectInput name="delivery_option" defaultValue="blantyre_pickup">
                {Object.entries(DELIVERY_OPTION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </SelectInput>
            </Field>
            <div className="flex items-center gap-3">
              <SubmitButton pending={pending} label="Place order" pendingLabel="Placing order…" />
              {state && (
                <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                  {state.message}
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="ekhaya-card p-5 sm:p-6">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-club-ink">
            Order summary
          </h2>
          <ul className="mt-4 divide-y divide-club-border">
            {items.map((item, idx) => (
              <li key={`${item.productId}-${idx}`} className="flex items-start justify-between gap-3 py-3">
                <div className="flex-1">
                  <p className="text-sm font-semibold text-club-ink">{item.name}</p>
                  {item.size && <p className="text-xs text-slate-500">Size {item.size}</p>}
                  {item.customText && <p className="text-xs text-slate-500">{item.customText}</p>}
                  <p className="text-xs text-slate-500">
                    Qty {item.quantity} × {formatMoney(item.unitPrice)}
                  </p>
                </div>
                <p className="text-sm font-semibold text-club-gold-700">
                  {formatMoney(item.unitPrice * item.quantity)}
                </p>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-club-border pt-3">
            <span className="text-sm font-medium text-slate-500">Total</span>
            <span className="font-display text-2xl font-semibold text-club-ink">{formatMoney(total)}</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Collection is from the club shop on your chosen option — delivery is free.
          </p>
        </div>
      </div>
    </div>
  );
}