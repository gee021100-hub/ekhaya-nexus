import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTeamBySlug, getPerformance, getCompetitions } from '@/lib/data';
import { TEAMS, type TeamSlug } from '@/types';
import { TeamNav } from '@/components/team-nav';
import { PerformanceView } from '@/components/performance-view';
import { PageHero } from '@/components/brand/hero';

export async function generateStaticParams() {
  return TEAMS.filter((t) => t.hasPerformance).map((t) => ({ team: t.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ team: string }> }): Promise<Metadata> {
  const { team } = await params;
  const config = TEAMS.find((t) => t.slug === team);
  return { title: config?.hasPerformance ? `${config.name} — Performance` : 'Performance' };
}

export default async function PerformancePage({ params }: { params: Promise<{ team: string }> }) {
  const { team: slug } = await params;
  const config = TEAMS.find((t) => t.slug === slug);
  if (!config || !config.hasPerformance) notFound();

  const team = await getTeamBySlug(slug);
  if (!team) notFound();

  const [performance, competitions] = await Promise.all([
    getPerformance(),
    getCompetitions(),
  ]);

  const performanceMap: Record<string, typeof performance> = {};
  for (const comp of competitions) {
    performanceMap[comp.id] = performance.filter((p) => p.competition_id === comp.id);
  }

  return (
    <div>
      <PageHero
        eyebrow="Ekhaya FC"
        title={`${config.name} — Performance`}
        subtitle="Player statistics by competition"
      />
      <TeamNav teamSlug={slug as TeamSlug} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PerformanceView
          competitions={competitions}
          initialPerformance={performanceMap}
        />
      </div>
    </div>
  );
}