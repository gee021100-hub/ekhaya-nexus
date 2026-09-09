import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPlayerById, getPerformanceByPlayer } from '@/lib/data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Player Profile',
};

export default async function SeniorPlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await getPlayerById(id);
  if (!player) notFound();

  const performance = await getPerformanceByPlayer(id);

  return (
    <div className="space-y-6">
      <Link
        href="/senior/players"
        className="inline-flex items-center gap-1 text-sm text-club-green-600 hover:text-club-green-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Players
      </Link>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-club-green-100 text-club-green-700 text-3xl font-bold">
            {player.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900">{player.name}</h2>
            <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Position</p>
                <p className="text-sm font-semibold text-slate-900">{player.position ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Strong Foot</p>
                <p className="text-sm font-semibold text-slate-900">{player.strong_foot ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Age</p>
                <p className="text-sm font-semibold text-slate-900">{player.age ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Goals</p>
                <p className="text-sm font-semibold text-club-green-700">{player.goals ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Assists</p>
                <p className="text-sm font-semibold text-club-green-700">{player.assists ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {performance.length > 0 && (
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Performance by Competition</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Competition</th>
                  <th className="px-4 py-3 text-center">Goals</th>
                  <th className="px-4 py-3 text-center">Assists</th>
                  <th className="px-4 py-3 text-center hidden sm:table-cell">Minutes</th>
                  <th className="px-4 py-3 hidden md:table-cell">Medical</th>
                </tr>
              </thead>
              <tbody>
                {performance.map((p) => (
                  <tr key={p.id} className="border-b last:border-b-0 hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium">{p.competition_name ?? '—'}</td>
                    <td className="px-4 py-3 text-center">{p.goals ?? '—'}</td>
                    <td className="px-4 py-3 text-center">{p.assists ?? '—'}</td>
                    <td className="px-4 py-3 text-center hidden sm:table-cell">
                      {p.minutes_played ?? '—'}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">{p.medical ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
