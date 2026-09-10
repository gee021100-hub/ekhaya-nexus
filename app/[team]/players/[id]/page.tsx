import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTeamBySlug, getPlayer } from '@/lib/data';
import { TEAMS } from '@/types';

export async function generateStaticParams() {
  return TEAMS.map((t) => ({ team: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ team: string; id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const player = await getPlayer(id);
  return { title: player?.name ?? 'Player' };
}

export default async function PlayerProfilePage({ params }: { params: Promise<{ team: string; id: string }> }) {
  const { team: slug, id } = await params;
  const config = TEAMS.find((t) => t.slug === slug);
  if (!config) notFound();

  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const player = await getPlayer(id);
  if (!player || player.team_id !== team.id) notFound();

  const fields = [
    { label: 'Position', value: player.position },
    { label: 'Strong Foot', value: player.strong_foot },
    { label: 'Age', value: player.age != null ? String(player.age) : null },
    { label: 'Goals', value: player.goals != null ? String(player.goals) : null },
    { label: 'Assists', value: player.assists != null ? String(player.assists) : null },
  ];

  return (
    <div>
      <div className="border-b border-slate-200 bg-club-green-700 px-4 py-8 text-white sm:py-12">
        <div className="mx-auto max-w-7xl">
          <nav className="mb-2 text-sm text-white/60">
            <Link href={`/${slug}`} className="hover:text-white transition-colors">
              {config.name}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${slug}/players`} className="hover:text-white transition-colors">
              Players
            </Link>
          </nav>
          <h1 className="text-3xl font-black tracking-tight">{player.name}</h1>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-club-green-100 text-3xl font-bold text-club-green-700">
              {player.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">{player.name}</h2>
              <p className="text-sm text-slate-500">{config.name}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label} className="rounded-xl bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase text-slate-500">{field.label}</p>
                <p className="mt-1 text-lg font-bold text-slate-900">
                  {field.value ?? '\u2014'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
