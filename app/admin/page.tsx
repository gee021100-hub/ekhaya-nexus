import type { Metadata } from 'next';
import Link from 'next/link';
import {
  getRegistrations,
  getTransfers,
  getWeeklyBudgets,
  getPettyCashTransactions,
  getStaffAllowances,
  getTrainingAllocations,
} from '@/lib/data';
import { formatMoney } from '@/lib/utils';

export const metadata: Metadata = { title: 'Administration' };

export default async function AdminDashboardPage() {
  const [registrations, transfers, budgets, pettyCash, staff, training] = await Promise.all([
    getRegistrations(),
    getTransfers(),
    getWeeklyBudgets(),
    getPettyCashTransactions(),
    getStaffAllowances(),
    getTrainingAllocations(),
  ]);

  const cashIn = pettyCash
    .filter((t) => t.transaction_type === 'in')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const cashOut = pettyCash
    .filter((t) => t.transaction_type === 'out')
    .reduce((sum, t) => sum + (t.amount ?? 0), 0);
  const balance = cashIn - cashOut;

  const pendingAllowances = staff.filter((s) => s.status === 'pending').length;

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
  ];

  return (
    <div className="space-y-8">
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