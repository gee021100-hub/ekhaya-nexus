import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTeamBySlug, getResults } from '@/lib/data';
import { TEAMS, type TeamSlug } from '@/types';
import { TeamNav } from '@/components/team-nav';
import { ResultsList } from '@/components/results-list';

export async function generateStaticParams() {
  return TEAMS.filter((t) => t.hasResults).map((t) => ({ team: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ team: string }> }): Promise<Metadata> {
  const { team } = await params;
  const config = TEAMS.find((t) => t.slug === team);
  return { title: `${config?.name ?? team} — Results` };
}

export default async function ResultsPage({ params }: { params: Promise<{ team: string }> }) {
  const { team: slug } = await params;
  const config = TEAMS.find((t) => t.slug === slug);
  if (!config || !config.hasResults) notFound();

  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const results = await getResults(team.id);

  return (
    <div>
      <div className="border-b border-slate-200 bg-club-green-700 px-4 py-8 text-white sm:py-12">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-black tracking-tight">{config.name} — Results</h1>
        </div>
      </div>
      <TeamNav teamSlug={slug as TeamSlug} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <ResultsList results={results} />
      </div>
    </div>
  );
}
