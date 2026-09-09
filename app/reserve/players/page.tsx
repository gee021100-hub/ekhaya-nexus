import type { Metadata } from 'next';
import { getTeamBySlug, getPlayersByTeam } from '@/lib/data';
import { PlayersGrid } from '@/components/players-grid';

export const metadata: Metadata = {
  title: 'Players',
};

export default async function ReservePlayersPage() {
  const team = await getTeamBySlug('reserve');
  const players = team ? await getPlayersByTeam(team.id) : [];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Squad</h2>
        <p className="text-sm text-slate-500">{players.length} players</p>
      </div>
      <PlayersGrid players={players} teamSlug="reserve" />
    </div>
  );
}
