import type { Metadata } from 'next';
import { getTeamBySlug, getFixturesByTeam } from '@/lib/data';
import { FixturesList } from '@/components/fixtures-list';

export const metadata: Metadata = {
  title: 'Fixtures',
};

export default async function WomenFixturesPage() {
  const team = await getTeamBySlug('women');
  const fixtures = team ? await getFixturesByTeam(team.id) : [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Fixtures</h2>
        <p className="text-sm text-slate-500">{fixtures.length} upcoming matches</p>
      </div>
      <FixturesList fixtures={fixtures} />
    </div>
  );
}
