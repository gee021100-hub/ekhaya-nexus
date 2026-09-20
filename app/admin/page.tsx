import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getRegistrations,
  getTransfers,
  getWeeklyBudgets,
  getPettyCashTransactions,
  getStaffAllowances,
  getTrainingAllocations,
  getPaymentTransactions,
  getRecentAppEvents,
  getStoreProducts,
  getStoreOrders,
  getFanPolls,
  getFanNotifications,
} from '@/lib/data';
import { formatMoney } from '@/lib/utils';
import { supabaseConfigured } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Administration' };

export default async function AdminDashboardPage() {
  const connected = supabaseConfigured();
  const [registrations, transfers, budgets, pettyCash, staff, training, payments, appEvents, storeProducts, storeOrders, fanPolls, fanNotifications] =
    await Promise.all([
      getRegistrations(),
      getTransfers(),
      getWeeklyBudgets(),
      getPettyCashTransactions(),
      getStaffAllowances(),
      getTrainingAllocations(),
      getPaymentTransactions(),
      getRecentAppEvents(),
      getStoreProducts(),
      getStoreOrders(),
      getFanPolls(),
      getFanNotifications(),
    ]);

  const cashIn = pettyCash
    .filter((t) => t.transaction_type === 'in')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const cashOut = pettyCash
    .filter((t) => t.transaction_type === 'out')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const balance = cashIn - cashOut;

  const pendingAllowances = staff.filter((s) => s.status === 'pending').length;

  const pendingPayments = payments.filter((p) => p.status === 'pending').length;
  const confirmedPayments = payments.filter((p) => p.status === 'confirmed');
  const confirmedRevenue = confirmedPayments.reduce((sum, p) => sum + (p.amount ?? 0), 0);

  const stats = [
    {
      label: 'Player registrations',
      value: String(registrations.length),
      to: '/admin/players',
    },
    { label: 'Transfers recorded', value: String(transfers.length), to: '/admin/transfers' },
    { label: 'Weekly budgets', value: String(budgets.length), to: '/admin/budget' },
    { label: 'Petty cash balance', value: formatMoney(balance), to: '/admin/petty-cash' },
    {
      label: 'Pending staff allowances',
      value: String(pendingAllowances),
      to: '/admin/staff',
    },
    { label: 'Training allocations', value: String(training.length), to: '/admin/training' },
    {
      label: 'Pending payments',
      value: String(pendingPayments),
      to: '/admin/payments',
    },
    {
      label: 'Confirmed revenue',
      value: formatMoney(confirmedRevenue),
      to: '/admin/payments',
    },
    {
      label: 'System errors (24h)',
      value: String(appEvents.filter((e) => e.level === 'error').length),
      to: '/admin/analytics',
    },
    {
      label: 'Store products',
      value: String(storeProducts.filter((p) => p.enabled).length),
      to: '/admin/store',
    },
    {
      label: 'Pending store orders',
      value: String(storeOrders.filter((o) => o.payment_status === 'pending').length),
      to: '/admin/store',
    },
    {
      label: 'Open polls',
      value: String(fanPolls.filter((p) => p.active).length),
      to: '/admin/polls',
    },
    {
      label: 'Fan broadcasts',
      value: String(fanNotifications.length),
      to: '/admin/notifications',
    },
  ];

  const modules = [
    {
      title: 'Player Registration',
      description: 'Register new players with the club — team, position, date of birth, fee.',
      to: '/admin/players',
    },
    {
      title: 'Transfers',
      description: 'Record incoming and outgoing player transfers with other clubs.',
      to: '/admin/transfers',
    },
    {
      title: 'Weekly Budget Preparation',
      description: 'Build the weekly budget and its line items for the coming week.',
      to: '/admin/budget',
    },
    {
      title: 'Petty Cash',
      description: 'Track small cash inflows and outflows with a running balance.',
      to: '/admin/petty-cash',
    },
    {
      title: 'Staff Allowance',
      description: 'Manage allowance payments for coaches, medical staff and support staff.',
      to: '/admin/staff',
    },
    {
      title: 'Training Allocation',
      description: 'Schedule training sessions per team with location, size and budget.',
      to: '/admin/training',
    },
    {
      title: 'News & Announcements',
      description: 'Publish club news for the public News page.',
      to: '/admin/news',
    },
    {
      title: 'Match Media & Highlights',
      description: 'Add highlights, videos and photos for the public Media page.',
      to: '/admin/media',
    },
    {
      title: 'Match Tickets',
      description: 'Open ticket sales per fixture with stand categories and pricing.',
      to: '/admin/tickets',
    },
    {
      title: 'Official Store',
      description: 'Manage the merchandise catalogue and follow up fan store orders.',
      to: '/admin/store',
    },
    {
      title: 'Fan Engagement',
      description: 'Publish polls and watch results as fans vote for their team.',
      to: '/admin/polls',
    },
    {
      title: 'Notifications',
      description: 'Broadcast match-day, news, ticket and store updates to the fan tray.',
      to: '/admin/notifications',
    },
    {
      title: 'Payments',
      description: 'Reconcile fan payments and confirm bookings, memberships and revenue.',
      to: '/admin/payments',
    },
    {
      title: 'Announcements',
      description: 'Publish short club updates that appear on the home page.',
      to: '/admin/announcements',
    },
    {
      title: 'Sponsors & Partners',
      description: 'Manage the supporters shown on the home and About pages.',
      to: '/admin/sponsors',
    },
    {
      title: 'Fan Messages',
      description: 'Read and manage messages sent by fans through the Contact page.',
      to: '/admin/messages',
    },
    {
      title: 'Site Settings',
      description: 'Edit contact details, social links and club information.',
      to: '/admin/settings',
    },
    {
      title: 'Dashboard & Reports',
      description: 'Aggregated football, administrative and fan engagement reports.',
      to: '/admin/reports',
    },
  ];

  return (
    <div className="space-y-8">
      <section
        className={`rounded-2xl border p-4 text-sm ${
          connected
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-amber-200 bg-amber-50 text-amber-800'
        }`}
      >
        {connected
          ? 'Connected to Supabase — reads and writes go to the PostgreSQL database, and the admin area is protected by Supabase Auth.'
          : 'In-memory mode — add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to connect the database, auth and storage.'}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">Overview</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              href={stat.to}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <p className="text-sm text-slate-500">{stat.label}</p>
              <p className="mt-1 text-2xl font-black text-club-green-700">{stat.value}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">System events</h2>
        {appEvents.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            No diagnostic events recorded yet. Once the <code className="rounded bg-slate-100 px-1">app_events</code> table is
            applied (migration 000008), errors are logged here automatically.
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {appEvents.map((event) => (
                <li key={event.id} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <span
                    className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      event.level === 'error'
                        ? 'bg-red-100 text-red-700'
                        : event.level === 'warn'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {event.level}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {event.message} <span className="text-slate-400">· {event.scope}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(event.created_at).toLocaleString()} {event.path ? `· ${event.path}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">Modules</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => (
            <Link
              key={module.title}
              href={module.to}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900 transition-colors group-hover:text-club-green-700">
                {module.title}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{module.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}