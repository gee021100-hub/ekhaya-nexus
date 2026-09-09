import type { Metadata } from 'next';
import { getTeamBySlug, getPlayersByTeam } from '@/lib/data';
import { PlayersGrid } from '@/components/players-grid';

export const metadata: Metadata = {
  title: 'Players',
};

export default async function YouthPlayersPage() {
  const team = await getTeamBySlug('youth');
  const players = team ? await getPlayersByTeam(team.id) : [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Squad</h2>
        <p className="text-sm text-slate-500">{players.length} players</p>
      </div>
      <PlayersGrid players={players} teamSlug="youth" />
    </div>
  );
}
