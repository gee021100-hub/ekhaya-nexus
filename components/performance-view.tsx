'use client';

import { useState } from 'react';
import type { Competition, Performance } from '@/types';
import { cn } from '@/lib/utils';

type PerformanceMap = Record<string, Performance[]>;

export function PerformanceView({
  competitions,
  initialPerformance,
}: {
  competitions: Competition[];
  initialPerformance: PerformanceMap;
}) {
  const [activeId, setActiveId] = useState<string>(
    competitions[0]?.id ?? '',
  );

  const activeCompetition = competitions.find((c) => c.id === activeId);
  const rows = initialPerformance[activeId] ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {competitions.map((comp) => (
          <button
            key={comp.id}
            type="button"
            onClick={() => setActiveId(comp.id)}
            className={cn(
              'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
              activeId === comp.id
                ? 'bg-club-gold text-club-ink'
                : 'bg-[#F7F5F0] text-[#3d3d3d] hover:bg-club-gold-100',
            )}
          >
            {comp.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-club-border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b-2 border-club-gold text-left text-xs font-semibold uppercase tracking-wider text-[#8a8a8a]">
              <th className="px-4 py-3">Player</th>
              <th className="px-4 py-3 text-center">Goals</th>
              <th className="px-4 py-3 text-center">Assists</th>
              <th className="px-4 py-3 text-center hidden sm:table-cell">Minutes</th>
              <th className="px-4 py-3 hidden md:table-cell">Medical</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-slate-500">
                  No performance data for {activeCompetition?.name ?? 'this competition'}.
                </td>
              </tr>
            )}
            {rows.map((p) => (
              <tr key={p.id} className="border-b border-club-border last:border-b-0 hover:bg-[#F7F5F0]">
                <td className="px-4 py-3 font-medium text-club-ink">
                  {p.player_name ?? '\u2014'}
                </td>
                <td className="px-4 py-3 text-center font-display font-semibold text-club-gold-700">
                  {p.goals ?? '\u2014'}
                </td>
                <td className="px-4 py-3 text-center font-display font-semibold text-club-gold-700">
                  {p.assists ?? '\u2014'}
                </td>
                <td className="px-4 py-3 text-center hidden sm:table-cell">
                  {p.minutes_played ?? '\u2014'}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">{p.medical ?? '\u2014'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
