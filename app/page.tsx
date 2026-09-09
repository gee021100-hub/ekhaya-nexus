import Link from 'next/link';
import { TEAMS } from '@/types';

const teamColors: Record<string, { bg: string; border: string; icon: string }> = {
  senior: { bg: 'bg-club-green-50', border: 'border-club-green-200', icon: 'bg-club-green-600' },
  women: { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-600' },
  reserve: { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-600' },
  youth: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-600' },
};

const teamIcons: Record<string, string> = {
  senior: 'S',
  women: 'W',
  reserve: 'R',
  youth: 'Y',
};

export default function DashboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          EKHAYA NEXUS
        </h1>
        <p className="mt-2 text-lg text-slate-600">
          Football Team Management & Statistics
        </p>
        <p className="mt-1 text-sm text-slate-500">
          Select a team to view their information
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {TEAMS.map((team) => {
          const colors = teamColors[team.slug];
          return (
            <Link
              key={team.slug}
              href={`/${team.slug}`}
              className={`group relative overflow-hidden rounded-xl border-2 ${colors.border} ${colors.bg} p-6 transition-all hover:shadow-lg hover:-translate-y-1`}
            >
              <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full ${colors.icon} text-white text-xl font-bold`}>
                {teamIcons[team.slug]}
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-club-green-700 transition-colors">
                {team.name}
              </h2>
              <p className="mt-1 text-sm text-slate-600">{team.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {team.hasStandings && (
                  <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 shadow-sm">
                    Standings
                  </span>
                )}
                <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 shadow-sm">
                  Players
                </span>
                {team.hasResults && (
                  <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 shadow-sm">
                    Results
                  </span>
                )}
                {team.hasFixtures && (
                  <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 shadow-sm">
                    Fixtures
                  </span>
                )}
                {team.hasPerformance && (
                  <span className="inline-block rounded-full bg-white px-2.5 py-0.5 text-xs font-medium text-slate-700 shadow-sm">
                    Performance
                  </span>
                )}
              </div>
              <div className="absolute right-4 top-4 text-slate-300 group-hover:text-slate-400 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
