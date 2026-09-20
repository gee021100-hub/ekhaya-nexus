import type { Metadata } from 'next';
import {
  getRegistrations,
  getTransfers,
  getWeeklyBudgets,
  getPettyCashTransactions,
  getStaffAllowances,
  getTrainingAllocations,
  getResults,
  getPlayers,
  getStandings,
  getPerformance,
  getNewsArticles,
  getMediaItems,
  getTicketAllocations,
  getTicketBookings,
  getMemberships,
  getPaymentTransactions,
  getTeamBySlug,
} from '@/lib/data';
import { formatMoney } from '@/lib/utils';
import type { Result } from '@/types';

export const metadata: Metadata = { title: 'Dashboard & Reports' };

function resultMark(result: Result): { mark: string; color: string } {
  const ekhayaScore =
    result.home_team.toLowerCase() === 'ekhaya' ? result.home_score : result.away_score;
  const opponentScore =
    result.home_team.toLowerCase() === 'ekhaya' ? result.away_score : result.home_score;
  if (ekhayaScore > opponentScore) return { mark: 'W', color: 'bg-club-green-100 text-club-green-700' };
  if (ekhayaScore === opponentScore) return { mark: 'D', color: 'bg-slate-100 text-slate-600' };
  return { mark: 'L', color: 'bg-red-100 text-red-700' };
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-club-green-700">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default async function ReportsPage() {
  const [seniorTeam, registrations, transfers, budgets, pettyCash, staff, training, news, media, allocations, bookings, memberships, standings, performance, payments] =
    await Promise.all([
      getTeamBySlug('senior'),
      getRegistrations(),
      getTransfers(),
      getWeeklyBudgets(),
      getPettyCashTransactions(),
      getStaffAllowances(),
      getTrainingAllocations(),
      getNewsArticles(),
      getMediaItems(),
      getTicketAllocations(),
      getTicketBookings(),
      getMemberships(),
      getStandings(),
      getPerformance(),
      getPaymentTransactions(),
    ]);

  const [results, players] = seniorTeam
    ? await Promise.all([getResults(seniorTeam.id), getPlayers(seniorTeam.id)])
    : [[], []];

  const seniorResults = results.sort((a, b) => b.match_date.localeCompare(a.match_date));
  const aggregate = seniorResults.reduce(
    (acc, r) => {
      const isHome = r.home_team.toLowerCase() === 'ekhaya';
      const scored = isHome ? r.home_score : r.away_score;
      const conceded = isHome ? r.away_score : r.home_score;
      acc.played += 1;
      if (scored > conceded) acc.wins += 1;
      else if (scored === conceded) acc.draws += 1;
      else acc.losses += 1;
      return acc;
    },
    { played: 0, wins: 0, draws: 0, losses: 0 },
  );

  const ekhayaStanding = standings.find((s) => s.team_name.toLowerCase() === 'ekhaya');

  const topScorers = [...players].sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0)).slice(0, 5);

  const cashIn = pettyCash.filter((t) => t.transaction_type === 'in').reduce((s, t) => s + (t.amount ?? 0), 0);
  const cashOut = pettyCash.filter((t) => t.transaction_type === 'out').reduce((s, t) => s + (t.amount ?? 0), 0);

  const budgetPlanned = budgets.reduce(
    (s, b) => s + (b.items ?? []).reduce((x, i) => x + (i.planned_amount ?? 0), 0),
    0,
  );
  const budgetActual = budgets.reduce(
    (s, b) => s + (b.items ?? []).reduce((x, i) => x + (i.actual_amount ?? 0), 0),
    0,
  );

  const transfersIn = transfers.filter((t) => t.transfer_type === 'in');
  const transfersOut = transfers.filter((t) => t.transfer_type === 'out');
  const transferFees = transfers.reduce((s, t) => s + (t.fee_amount ?? 0), 0);

  const allowanceTotal = staff.reduce((s, a) => s + (a.amount ?? 0), 0);
  const pendingAllowances = staff.filter((s) => s.status === 'pending');
  const paidAllowances = staff.filter((s) => s.status === 'paid');

  const memberByType = memberships.reduce<Record<string, number>>((acc, m) => {
    acc[m.member_type] = (acc[m.member_type] ?? 0) + 1;
    return acc;
  }, {});

  const revenue = allocations.reduce(
    (s, a) => s + (a.sold ?? 0) * (a.price ?? 0),
    0,
  );

  const confirmedPayments = payments.filter((p) => p.status === 'confirmed');
  const pendingPayments = payments.filter((p) => p.status === 'pending');
  const paidTickets = bookings.filter((b) => b.payment_status === 'paid');
  const confirmedRevenue = confirmedPayments.reduce((s, p) => s + (p.amount ?? 0), 0);
  const pendingRevenue = pendingPayments.reduce((s, p) => s + (p.amount ?? 0), 0);

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Football Performance</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Matches played" value={String(aggregate.played)} />
          <StatCard label="Record" value={`${aggregate.wins}W / ${aggregate.draws}D / ${aggregate.losses}L`} />
          <StatCard
            label="League position"
            value={ekhayaStanding ? `#${ekhayaStanding.position}` : '—'}
            hint={ekhayaStanding ? `${ekhayaStanding.points} pts` : 'No standings'}
          />
          <StatCard label="Performance rows" value={String(performance.length)} hint="Senior team only" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-bold text-slate-900">Form — last 5</h3>
            {seniorResults.length === 0 ? (
              <p className="text-sm text-slate-500">No results yet.</p>
            ) : (
              <div className="flex items-center gap-2">
                {seniorResults.slice(0, 5).map((r, i) => {
                  const { mark, color } = resultMark(r);
                  return (
                    <span
                      key={i}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${color}`}
                    >
                      {mark}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-base font-bold text-slate-900">Top scorers</h3>
            {topScorers.length === 0 ? (
              <p className="text-sm text-slate-500">No player goal data.</p>
            ) : (
              <div className="space-y-2">
                {topScorers.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-900">{p.name}</span>
                    <span className="font-bold text-club-green-700">
                      {p.goals ?? 0}G {p.assists ?? 0}A
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900">Administration</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Player registrations" value={String(registrations.length)} />
          <StatCard
            label="Transfers"
            value={String(transfers.length)}
            hint={`${transfersIn.length} in · ${transfersOut.length} out`}
          />
          <StatCard label="Transfer fees" value={formatMoney(transferFees)} />
          <StatCard label="Weekly budgets" value={String(budgets.length)} hint={formatMoney(budgetActual) + ' actual'} />
          <StatCard label="Petty cash balance" value={formatMoney(cashIn - cashOut)} hint={`${formatMoney(cashIn)} in · ${formatMoney(cashOut)} out`} />
          <StatCard label="Staff allowances" value={formatMoney(allowanceTotal)} hint={`${paidAllowances.length} paid · ${pendingAllowances.length} pending`} />
          <StatCard label="Training allocations" value={String(training.length)} />
          <StatCard label="Budget planned (items)" value={formatMoney(budgetPlanned)} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900">Digital &amp; Fan Engagement</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="News articles" value={String(news.length)} />
          <StatCard label="Media items" value={String(media.length)} />
          <StatCard label="Ticket allocations" value={String(allocations.length)} />
          <StatCard label="Ticket revenue" value={formatMoney(revenue)} hint={`${bookings.length} bookings`} />
          <StatCard label="Memberships" value={String(memberships.length)} />
          <StatCard label="Paid bookings" value={String(paidTickets.length)} hint={`${pendingPayments.length} payments pending`} />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold text-slate-900">Online Payments</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Confirmed revenue" value={formatMoney(confirmedRevenue)} hint={`${confirmedPayments.length} confirmed`} />
          <StatCard label="Pending revenue" value={formatMoney(pendingRevenue)} hint={`${pendingPayments.length} awaiting verification`} />
          <StatCard label="Payment records" value={String(payments.length)} />
          <StatCard
            label="Membership payments"
            value={String(confirmedPayments.filter((p) => p.booking_type === 'membership').length)}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-base font-bold text-slate-900">Membership breakdown</h3>
        {memberships.length === 0 ? (
          <p className="text-sm text-slate-500">No members yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(memberByType).map(([type, count]) => (
              <span key={type} className="rounded-full bg-club-green-100 px-3 py-1 text-sm font-medium capitalize text-club-green-700">
                {type}: {count}
              </span>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}