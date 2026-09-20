import type { Metadata } from 'next';
import { getPaymentTransactions, getTicketBookings, getMemberships } from '@/lib/data';
import { PaymentsList } from '@/components/admin/payments-list';
import { paymentMode, paymentModeLabel } from '@/lib/payments';

export const metadata: Metadata = { title: 'Payments' };

const mode = paymentMode();

export default async function AdminPaymentsPage() {
  const [payments, bookings, memberships] = await Promise.all([
    getPaymentTransactions(),
    getTicketBookings(),
    getMemberships(),
  ]);

  const bookingById = new Map(bookings.map((b) => [b.id, b]));
  const membershipById = new Map(memberships.map((m) => [m.id, m]));

  const describe = (payment: (typeof payments)[number]): string => {
    if (payment.booking_type === 'membership') {
      const membership = membershipById.get(payment.booking_id);
      return membership ? `Membership · ${membership.member_type}` : 'Membership';
    }
    if (payment.booking_type === 'store') {
      return 'Store order';
    }
    const booking = bookingById.get(payment.booking_id);
    return booking ? `Tickets · booking ${booking.reference}` : 'Tickets';
  };

  const items = payments.map((payment) => ({
    ...payment,
    description: describe(payment),
  }));

  const pending = payments.filter((p) => p.status === 'pending').length;
  const confirmed = payments.filter((p) => p.status === 'confirmed').length;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Payments</h2>
        <p className="mt-1 text-sm text-slate-500">
          Reconcile fan payments against the club&apos;s mobile-money wallets before confirming.
          <span className="ml-2 rounded-full bg-club-gold-100 px-2.5 py-0.5 text-xs font-semibold text-club-gold-800">
            {paymentModeLabel(mode)}
          </span>
        </p>
        {mode === 'sandbox' && (
          <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Demo mode: payments auto-confirm. Set PAYMENT_MODE=manual in production and verify
            each wallet reference here before confirming.
          </p>
        )}
        <div className="mt-3 flex gap-2 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">
            {pending} pending
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-medium text-emerald-800">
            {confirmed} confirmed
          </span>
        </div>
      </section>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No payments yet. When fans book tickets or join as members, their payment requests
          appear here.
        </div>
      ) : (
        <PaymentsList payments={items} />
      )}
    </div>
  );
}