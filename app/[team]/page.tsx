import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTeamBySlug, getPlayers, getResults, getFixtures, getStandings } from '@/lib/data';
import { TEAMS, type TeamSlug } from '@/types';
import { TeamNav } from '@/components/team-nav';
import { PlayersGrid } from '@/components/players-grid';
import { ResultsList } from '@/components/results-list';
import { FixturesList } from '@/components/fixtures-list';
import { StandingsTable } from '@/components/standings-table';

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
      <div className="border-b border-slate-200 bg-club-green-700 px-4 py-8 text-white sm:py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-black tracking-tight">{config.name}</h1>
          <p className="mt-1 text-sm text-white/70">{config.description}</p>
        </div>
      </div>
      <TeamNav teamSlug={slug as TeamSlug} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {config.hasStandings && standings.length > 0 && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900">League Standings</h2>
            <StandingsTable standings={standings} />
          </section>
        )}
        <section>
          <h2 className="mb-4 text-xl font-bold text-slate-900">Players</h2>
          <PlayersGrid players={players} teamSlug={slug} />
        </section>
        {config.hasResults && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900">Recent Results</h2>
            <ResultsList results={results.slice(0, 5)} />
          </section>
        )}
        {config.hasFixtures && (
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900">Upcoming Fixtures</h2>
            <FixturesList fixtures={fixtures.slice(0, 5)} />
          </section>
        )}
      </div>
    </div>
  );
}
