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
              'rounded-full px-4 py-2 text-sm font-medium transition-colors',
              activeId === comp.id
                ? 'bg-club-green-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            {comp.name}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
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
              <tr key={p.id} className="border-b last:border-b-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {p.player_name ?? '\u2014'}
                </td>
                <td className="px-4 py-3 text-center text-club-green-700">
                  {p.goals ?? '\u2014'}
                </td>
                <td className="px-4 py-3 text-center text-club-green-700">
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
