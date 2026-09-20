import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTeamBySlug, getPlayer } from '@/lib/data';
import { TEAMS } from '@/types';
import { PageHero } from '@/components/brand/hero';

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
    { label: 'Squad Number', value: player.number != null ? `#${player.number}` : null },
    { label: 'Position', value: player.position },
    { label: 'Strong Foot', value: player.strong_foot },
    { label: 'Age', value: player.age != null ? String(player.age) : null },
    { label: 'Goals', value: player.goals != null ? String(player.goals) : null },
    { label: 'Assists', value: player.assists != null ? String(player.assists) : null },
  ];

  return (
    <div>
      <PageHero eyebrow="Ekhaya FC" title={player.name}>
        <nav className="mt-2 flex items-center gap-1.5 text-sm text-slate-300">
          <Link href={`/${slug}`} className="font-medium text-club-gold-300 hover:underline">
            {config.name}
          </Link>
          <span>/</span>
          <Link href={`/${slug}/players`} className="font-medium text-club-gold-300 hover:underline">
            Players
          </Link>
        </nav>
      </PageHero>
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="ekhaya-card p-8">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-club-gold-100 text-3xl font-bold text-club-gold-700">
              {player.name.charAt(0)}
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold uppercase tracking-wide text-club-ink">{player.name}</h2>
              <p className="text-sm uppercase tracking-wide text-[#8a8a8a]">{config.name}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label} className="rounded-xl border border-club-border bg-[#FFFDF7] p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8a8a8a]">{field.label}</p>
                <p className="font-display mt-1 text-xl font-semibold text-club-ink">
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
