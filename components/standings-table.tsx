import type { Standing } from '@/types';
import { cn } from '@/lib/utils';
import { TeamLogo } from '@/components/brand/team-logo';

export function StandingsTable({ standings }: { standings: Standing[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-[#e7e2d6] bg-white">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b-2 border-club-gold text-left text-xs font-semibold uppercase tracking-wider text-[#8a8a8a]">
            <th className="px-4 py-3">Pos</th>
            <th className="px-4 py-3">Team</th>
            <th className="px-4 py-3 text-center">P</th>
            <th className="px-4 py-3 text-center">W</th>
            <th className="px-4 py-3 text-center">D</th>
            <th className="px-4 py-3 text-center">L</th>
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
                  'border-b border-[#e7e2d6] last:border-b-0 hover:bg-[#f7f5f0]',
                  isEkhaya && 'bg-[#fbf3d9] font-semibold hover:bg-[#fbf3d9]',
                )}
              >
                <td className="px-4 py-3 text-[#8a8a8a]">{row.position}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-2">
                    <TeamLogo name={row.team_name} size="sm" />
                    <span className={cn(isEkhaya && 'text-club-gold-700')}>{row.team_name}</span>
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{row.played}</td>
                <td className="px-4 py-3 text-center">{row.wins}</td>
                <td className="px-4 py-3 text-center">{row.draws}</td>
                <td className="px-4 py-3 text-center">{row.losses}</td>
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