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
      <div className="rounded-xl border border-dashed border-club-border bg-white p-10 text-center text-slate-500">
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
          className="group ekhaya-card p-5"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-club-gold-100 font-display text-lg font-semibold text-club-gold-700">
              {player.number ?? player.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <h3 className="font-display truncate text-lg font-semibold uppercase tracking-wide text-club-ink group-hover:text-club-gold-700">
                {player.number != null ? `#${player.number} ` : ''}
                {player.name}
              </h3>
              <p className="text-sm text-slate-500">
                {player.position ?? '\u2014'} {player.age ? `\u00b7 ${player.age}` : ''}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-club-border pt-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8a8a]">Goals</p>
              <p className="font-display mt-0.5 text-xl font-semibold text-club-gold-700">
                {player.goals ?? '\u2014'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8a8a]">Assists</p>
              <p className="font-display mt-0.5 text-xl font-semibold text-club-gold-700">
                {player.assists ?? '\u2014'}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
