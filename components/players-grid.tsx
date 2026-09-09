import Link from 'next/link';
import type { Player } from '@/types';

export function PlayersGrid({
  players,
  teamSlug,
}: {
  players: Player[];
  teamSlug: string;
}) {
  if (players.length === 0) {
    return (
      <div className="rounded-xl border border-dashed bg-slate-50 p-10 text-center text-slate-500">
        No players available for this team yet.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {players.map((player) => (
        <Link
          key={player.id}
          href={`/${teamSlug}/players/${player.id}`}
          className="group rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-club-green-100 text-lg font-bold text-club-green-700">
              {player.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-semibold text-slate-900 group-hover:text-club-green-700">
                {player.name}
              </h3>
              <p className="text-sm text-slate-500">
                {player.position ?? '\u2014'} {player.age ? `\u00b7 ${player.age}` : ''}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t pt-3">
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Goals</p>
              <p className="text-lg font-bold text-club-green-700">
                {player.goals ?? '\u2014'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase text-slate-500">Assists</p>
              <p className="text-lg font-bold text-club-green-700">
                {player.assists ?? '\u2014'}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
