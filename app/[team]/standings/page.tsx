import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTeamBySlug, getStandings } from '@/lib/data';
import { TEAMS, type TeamSlug } from '@/types';
import { TeamNav } from '@/components/team-nav';
import { StandingsTable } from '@/components/standings-table';
import { PageHero } from '@/components/brand/hero';

export async function generateStaticParams() {
  return TEAMS.filter((t) => t.hasStandings).map((t) => ({ team: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ team: string }> }): Promise<Metadata> {
  const { team } = await params;
  const config = TEAMS.find((t) => t.slug === team);
  return { title: `${config?.name ?? team} — Standings` };
}

export default async function StandingsPage({ params }: { params: Promise<{ team: string }> }) {
  const { team: slug } = await params;
  const config = TEAMS.find((t) => t.slug === slug);
  if (!config || !config.hasStandings) notFound();

  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const standings = await getStandings();

  return (
    <div>
      <PageHero
        eyebrow="Ekhaya FC"
        title={`${config.name} — Standings`}
      />
      <TeamNav teamSlug={slug as TeamSlug} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <StandingsTable standings={standings} />
      </div>
    </div>
  );
}
