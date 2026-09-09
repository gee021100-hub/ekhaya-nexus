import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPlayerById } from '@/lib/data';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Player Profile',
};

export default async function YouthPlayerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const player = await getPlayerById(id);
  if (!player) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/youth/players"
        className="inline-flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        Back to Players
      </Link>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-700 text-3xl font-bold">
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
                <p className="text-sm font-semibold text-amber-700">{player.goals ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs font-medium uppercase text-slate-500">Assists</p>
                <p className="text-sm font-semibold text-amber-700">{player.assists ?? '—'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
