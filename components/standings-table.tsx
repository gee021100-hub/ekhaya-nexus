import type { Standing } from '@/types';
import { cn } from '@/lib/utils';

export function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3">Pos</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3 text-center">P</th>
            <th className="px-4 py-3 text-center">W</th>
            <th className="px-4 py-3 text-center">D</th>
            <th className="px-4 py-3 text-center">L</th>
            <th className="px-4 py-3 text-center">GF</th>
            <th className="px-4 py-3 text-center">GA</th>
            <th className="px-4 py-3 text-center">GD</th>
            <th className="px-4 py-3 text-center font-bold">Pts</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row) => {
            const isEkhaya = row.team_name.toLowerCase() === 'ekhaya';
            return (
              <tr
                key={row.id}
                className={cn(
                  'border-b last:border-b-0 hover:bg-slate-50',
                  isEkhaya && 'bg-club-gold-100 font-semibold hover:bg-club-gold-100',
                )}
              >
                <td className="px-4 py-3 text-slate-500">{row.position}</td>
                <td className="px-4 py-3">{row.team_name}</td>
                <td className="px-4 py-3 text-center">{row.played}</td>
                <td className="px-4 py-3 text-center">{row.wins}</td>
                <td className="px-4 py-3 text-center">{row.draws}</td>
                <td className="px-4 py-3 text-center">{row.losses}</td>
                <td className="px-4 py-3 text-center">{row.goals_for}</td>
                <td className="px-4 py-3 text-center">{row.goals_against}</td>
                <td className="px-4 py-3 text-center">{row.goal_difference}</td>
                <td className="px-4 py-3 text-center font-bold">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
