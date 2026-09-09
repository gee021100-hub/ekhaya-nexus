import type { Metadata } from 'next';
import { getStandings } from '@/lib/data';
import { StandingsTable } from '@/components/standings-table';

export const metadata: Metadata = {
  title: 'Standings',
};

export default async function StandingsPage() {
  const standings = await getStandings();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">League Standings</h2>
        <p className="text-sm text-slate-500">FDH Championship 2025/26 Season</p>
      </div>
      <StandingsTable standings={standings} />
      <p className="text-xs text-slate-500">
        Tie-breaker: If teams finish on equal points, goal difference is the tie-breaker.
      </p>
    </div>
  );
}
