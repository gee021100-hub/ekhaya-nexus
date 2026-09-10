import Link from 'next/link';
import { TEAMS } from '@/types';
import { Footer } from '@/components/brand/footer';

export default async function HomePage() {

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero */}
      <section className="bg-club-green-700 px-4 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-3xl font-black">
            EF
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
            EKHAYA FC
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Football team management and statistics for Ekhaya Football Club.
            Senior, Women&apos;s, Reserve and Youth team info, standings, results,
            fixtures and performance.
          </p>
        </div>
      </section>

      {/* Team cards */}
      <section className="mx-auto w-full max-w-5xl px-4 py-12 sm:py-16">
        <h2 className="mb-8 text-2xl font-black tracking-tight text-slate-900">
          Our Teams
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAMS.map((teamConfig) => {
            return (
              <Link
                key={teamConfig.slug}
                href={`/${teamConfig.slug}`}
                className="group rounded-2xl border bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-club-green-100 text-xl font-bold text-club-green-700 group-hover:bg-club-green-700 group-hover:text-white transition-colors">
                  {teamConfig.name.charAt(0)}
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-club-green-700 transition-colors">
                  {teamConfig.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {teamConfig.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {teamConfig.hasStandings && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      Standings
                    </span>
                  )}
                  {teamConfig.hasResults && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      Results
                    </span>
                  )}
                  {teamConfig.hasFixtures && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      Fixtures
                    </span>
                  )}
                  {teamConfig.hasPerformance && (
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                      Performance
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Quick links */}
      <section className="border-t border-slate-200 bg-slate-50 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-2xl font-black tracking-tight text-slate-900">
            Quick Access
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Link
              href="/senior/standings"
              className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900">FDH Championship</h3>
              <p className="mt-1 text-sm text-slate-500">
                View the current league standings for the Senior Team.
              </p>
            </Link>
            <Link
              href="/senior/results"
              className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900">Latest Results</h3>
              <p className="mt-1 text-sm text-slate-500">
                See recent match results across all teams.
              </p>
            </Link>
            <Link
              href="/senior/performance"
              className="rounded-xl border bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <h3 className="font-bold text-slate-900">Performance</h3>
              <p className="mt-1 text-sm text-slate-500">
                Player stats broken down by competition.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
