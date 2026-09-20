import type { PaymentMode, SiteSettings } from '@/types';

/**
 * Payment provider abstraction for the Ekhaya FC platform.
 *
 * Fans pay by mobile money (Mpamba / Airtel Money). The club reconciles each
 * payment against its wallet in the admin Payments module.
 *
 * Two modes, selected by the PAYMENT_MODE environment variable:
 *
 *   sandbox (default) — every payment auto-confirms. Intended for development
 *   and demonstration only; never use it with real money.
 *
 *   manual             — fan-paid payments stay pending until staff verify the
 *   fan's wallet reference against the club's mobile-money account and confirm
 *   it in /admin/payments.
 *
 * A real aggregator (card / online request-to-pay) can be added later by
 * implementing a provider behind the same RPCs — the fan flow, the payment
 * table and the admin reconciliation screen do not change.
 */

export function paymentMode(): PaymentMode {
  const mode = String(process.env.PAYMENT_MODE ?? 'sandbox').toLowerCase();
  return mode === 'manual' ? 'manual' : 'sandbox';
}

/** Mobile-money wallets the club accepts. */
export const MOBILE_MONEY_PROVIDERS = ['Mpamba', 'Airtel Money'] as const;

export type MobileMoneyProvider = (typeof MOBILE_MONEY_PROVIDERS)[number];

/**
 * Which wallet a fan is asked to pay into, from the admin-editable site
 * settings. Returns an empty array when the club hasn't configured wallets yet.
 */
export function paymentWallets(settings: SiteSettings): { provider: string; number: string }[] {
  const wallets: { provider: string; number: string }[] = [];
  if (settings.payment_to_mpamba) wallets.push({ provider: 'Mpamba', number: settings.payment_to_mpamba });
  if (settings.payment_to_airtel) wallets.push({ provider: 'Airtel Money', number: settings.payment_to_airtel });
  return wallets;
}

export function paymentInstructions(settings: SiteSettings, fallback: string): string {
  return (settings.payment_instructions ?? '').trim() || fallback;
}

/** Public note shown on the payment panel depending on the current mode. */
export function paymentModeNotice(mode: PaymentMode): string {
  return mode === 'manual'
    ? 'Pay by mobile money, then enter your wallet transaction reference. The club verifies each payment before confirming your booking.'
    : 'Demo mode — payments are simulated and confirm immediately. This must never be used with real money.';
}

/** A mode flag rendered next to the payment amount for staff transparency. */
export function paymentModeLabel(mode: PaymentMode): string {
  return mode === 'manual' ? 'Manual verification' : 'Sandbox (demo)';
}