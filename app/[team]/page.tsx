import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTeamBySlug, getPlayers, getResults, getFixtures, getStandings } from '@/lib/data';
import { TEAMS, type TeamSlug } from '@/types';
import { TeamNav } from '@/components/team-nav';
import { PlayersGrid } from '@/components/players-grid';
import { ResultsList } from '@/components/results-list';
import { FixturesList } from '@/components/fixtures-list';
import { StandingsTable } from '@/components/standings-table';
import { PageHero } from '@/components/brand/hero';

export async function generateStaticParams() {
  return TEAMS.map((t) => ({ team: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ team: string }> }): Promise<Metadata> {
  const { team } = await params;
  const config = TEAMS.find((t) => t.slug === team);
  return { title: config?.name ?? team };
}

export default async function TeamPage({ params }: { params: Promise<{ team: string }> }) {
  const { team: slug } = await params;
  const config = TEAMS.find((t) => t.slug === slug);
  if (!config) notFound();

  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const [players, results, fixtures, standings] = await Promise.all([
    getPlayers(team.id),
    config.hasResults ? getResults(team.id) : Promise.resolve([]),
    config.hasFixtures ? getFixtures(team.id) : Promise.resolve([]),
    config.hasStandings ? getStandings() : Promise.resolve([]),
  ]);

  return (
    <div>
      <PageHero
        eyebrow="Ekhaya FC"
        title={config.name}
        subtitle={config.description ?? undefined}
      />
      <TeamNav teamSlug={slug as TeamSlug} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {config.hasStandings && standings.length > 0 && (
          <section>
            <h2 className="font-display mb-4 text-2xl font-semibold uppercase tracking-wide text-club-ink">League Standings</h2>
            <StandingsTable standings={standings} />
          </section>
        )}
        <section>
          <h2 className="font-display mb-4 text-2xl font-semibold uppercase tracking-wide text-club-ink">Players</h2>
          <PlayersGrid players={players} teamSlug={slug} />
        </section>
        {config.hasResults && (
          <section>
            <h2 className="font-display mb-4 text-2xl font-semibold uppercase tracking-wide text-club-ink">Recent Results</h2>
            <ResultsList results={results.slice(0, 5)} />
          </section>
        )}
        {config.hasFixtures && (
          <section>
            <h2 className="font-display mb-4 text-2xl font-semibold uppercase tracking-wide text-club-ink">Upcoming Fixtures</h2>
            <FixturesList fixtures={fixtures.slice(0, 5)} />
          </section>
        )}
      </div>
    </div>
  );
}
