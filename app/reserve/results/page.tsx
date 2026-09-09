import type { Metadata } from 'next';
import { getTeamBySlug, getResultsByTeam } from '@/lib/data';
import { ResultsList } from '@/components/results-list';

export const metadata: Metadata = {
  title: 'Results',
};

export default async function ReserveResultsPage() {
  const team = await getTeamBySlug('reserve');
  const results = team ? await getResultsByTeam(team.id) : [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Results</h2>
        <p className="text-sm text-slate-500">{results.length} matches played</p>
      </div>
      <ResultsList results={results} />
    </div>
  );
}
