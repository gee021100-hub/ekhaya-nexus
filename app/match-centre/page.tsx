import type { Metadata } from 'next';
import Link from 'next/link';
import { getTeams, getFixtures, getResults, getPlayers, getStandings, getPerformance } from '@/lib/data';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';
import { TeamLogo } from '@/components/brand/team-logo';

export const metadata: Metadata = { title: 'Live Match Centre' };

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(date: string): string {
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatTime(time: string | null): string | null {
  if (!time) return 'TBC';
  const [h, m] = time.split(':');
  const hours = Number(h);
  const suffix = hours >= 12 ? 'PM' : 'AM';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${displayHour}:${m} ${suffix}`;
}

function daysUntil(date: string): number {
  const target = new Date(`${date}T00:00:00`).getTime();
  const now = new Date(today() + 'T00:00:00').getTime();
  return Math.round((target - now) / 86_400_000);
}

export default async function MatchCentrePage() {
  const teams = await getTeams();
  const [fixturesByTeam, resultsByTeam, playersByTeam] = await Promise.all([
    Promise.all(teams.map(async (t) => ({ team: t, fixtures: await getFixtures(t.id) }))),
    Promise.all(teams.map(async (t) => ({ team: t, results: await getResults(t.id) }))),
    Promise.all(teams.map(async (t) => ({ team: t, players: await getPlayers(t.id) }))),
  ]);
  const [standings, performance] = await Promise.all([getStandings(), getPerformance()]);

  const allFixtures = fixturesByTeam.flatMap(({ fixtures }) => fixtures);
  const allResults = resultsByTeam.flatMap(({ results }) => results);
  const senior = teams.find((team) => team.slug === 'senior') ?? null;

  const liveMatches = allFixtures.filter((f) => f.match_date === today());
  const upcoming = [...allFixtures]
    .filter((f) => f.match_date > today())
    .sort((a, b) => a.match_date.localeCompare(b.match_date));
  const nextMatch = upcoming[0] ?? null;

  const latestResults = [...allResults].sort((a, b) =>
    b.match_date.localeCompare(a.match_date),
  );
  const formLast5 = latestResults.slice(0, 5);

  const seniorResults = resultsByTeam.find((r) => r.team.slug === 'senior')?.results ?? [];
  const aggregate = seniorResults.reduce(
    (acc, r) => {
      const isHome = r.home_team.toLowerCase() === 'ekhaya';
      const scored = isHome ? r.home_score : r.away_score;
      const conceded = isHome ? r.away_score : r.home_score;
      acc.played += 1;
      acc.goalsFor += scored;
      acc.goalsAgainst += conceded;
      if (scored > conceded) acc.wins += 1;
      else if (scored === conceded) acc.draws += 1;
      else acc.losses += 1;
      return acc;
    },
    { played: 0, wins: 0, draws: 0, losses: 0, goalsFor: 0, goalsAgainst: 0 },
  );

  const ekhayaStanding = standings.find((s) => s.team_name.toLowerCase() === 'ekhaya');

  const topScorers = playersByTeam
    .flatMap(({ players }) => players)
    .filter((p) => (p.goals ?? 0) > 0)
    .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))
    .slice(0, 5);

  const topPerformers = [...performance]
    .filter((p) => (p.goals ?? 0) > 0 || (p.assists ?? 0) > 0)
    .sort(
      (a, b) =>
        ((b.goals ?? 0) + (b.assists ?? 0)) -
        ((a.goals ?? 0) + (a.assists ?? 0)),
    )
    .slice(0, 5);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Live Match Centre"
        subtitle="Scores, results, line-ups and match statistics for Ekhaya FC."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-10 px-4 py-8 sm:px-6 lg:px-8">
        {/* Live / next match — dark fan-app scoreboard */}
        <section className="scoreboard rounded-2xl px-6 py-8 text-center shadow-lg">
          {liveMatches.length > 0 ? (
            <>
              <p className="status-live mx-auto mb-4">
                <span aria-hidden>●</span> Live now
              </p>
              {liveMatches.map((m) => (
                <div key={m.id} className="mx-auto flex max-w-3xl items-center justify-center gap-4 sm:gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <TeamLogo name={m.home_team} size="2xl" />
                    <span className="score-team text-sm sm:text-base">{m.home_team}</span>
                  </div>
                  <span className="font-display m-0 text-4xl text-white sm:text-5xl" aria-hidden>
                    vs
                  </span>
                  <div className="flex flex-col items-center gap-2">
                    <TeamLogo name={m.away_team} size="2xl" />
                    <span className="score-team text-sm sm:text-base">{m.away_team}</span>
                  </div>
                </div>
              ))}
              <p className="score-meta mt-6 text-xs">
                {liveMatches.map((m) => formatTime(m.match_time)).join(', ')}{' '}
                {liveMatches[0]?.competition_name ? `· ${liveMatches[0].competition_name}` : ''}
              </p>
            </>
          ) : nextMatch ? (
            <>
              <p className="mx-auto mb-4 inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-club-gold-300">
                No live match right now — next kick-off
              </p>
              <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-5">
                <div className="flex flex-col items-center gap-2">
                  <TeamLogo name={nextMatch.home_team} size="2xl" />
                  <span className="score-team text-sm sm:text-base">{nextMatch.home_team}</span>
                </div>
                <span className="score-gold select-none text-4xl sm:text-5xl" aria-hidden>
                  vs
                </span>
                <div className="flex flex-col items-center gap-2">
                  <TeamLogo name={nextMatch.away_team} size="2xl" />
                  <span className="score-team text-sm sm:text-base">{nextMatch.away_team}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <span className="text-xs text-white/80">
                  {formatDate(nextMatch.match_date)} · {formatTime(nextMatch.match_time)}
                </span>
                {nextMatch.competition_name && (
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-semibold text-club-gold-300">
                    {nextMatch.competition_name}
                  </span>
                )}
                <span className="gold-pill">{daysUntil(nextMatch.match_date)} days to go</span>
              </div>
            </>
          ) : (
            <p className="text-slate-300">No matches scheduled yet.</p>
          )}
        </section>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            {/* Latest results */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">Latest Results</h2>
                <Link href="/senior/results" className="text-sm font-semibold text-club-gold-700 hover:underline">
                  All results →
                </Link>
              </div>
              {latestResults.length === 0 ? (
                <div className="rounded-xl border border-dashed border-club-border bg-white p-10 text-center text-slate-500">
                  No results yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {latestResults.slice(0, 5).map((r) => {
                    const isHome = r.home_team.toLowerCase() === 'ekhaya';
                    const scored = isHome ? r.home_score : r.away_score;
                    const conceded = isHome ? r.away_score : r.home_score;
                    const win = scored > conceded;
                    const draw = scored === conceded;
                    return (
                      <div
                        key={r.id}
                        className="flex items-center justify-between rounded-xl border border-club-border bg-white p-4"
                      >
                        <div className="flex items-center gap-3">
                          <span className={win ? 'status-w' : draw ? 'status-d' : 'status-l'}>
                            {win ? 'W' : draw ? 'D' : 'L'}
                          </span>
                          <span className="font-medium text-slate-900">
                            <span className="flex items-center gap-2">
                              <TeamLogo name={r.home_team} size="sm" />
                              {r.home_team}{' '}
                              <strong className={isHome ? 'text-club-gold-700' : ''}>
                                {r.home_score}
                              </strong>{' '}
                              <span className="text-slate-400">-</span>{' '}
                              <strong className={!isHome ? 'text-club-gold-700' : ''}>
                                {r.away_score}
                              </strong>{' '}
                              {r.away_team}
                              <TeamLogo name={r.away_team} size="sm" />
                            </span>
                          </span>
                        </div>
                        <span className="hidden text-sm text-slate-500 sm:inline">
                          {formatDate(r.match_date)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Upcoming fixtures */}
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">Upcoming Fixtures</h2>
                <Link href="/senior/fixtures" className="text-sm font-semibold text-club-gold-700 hover:underline">
                  All fixtures →
                </Link>
              </div>
              {upcoming.length === 0 ? (
                <div className="rounded-xl border border-dashed border-club-border bg-white p-10 text-center text-slate-500">
                  No upcoming fixtures yet.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {upcoming.slice(0, 6).map((f) => (
                    <div key={f.id} className="rounded-xl border border-club-border bg-white p-4">
                      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-semibold text-club-ink">
                        <TeamLogo name={f.home_team} size="sm" />
                        {f.home_team} <span className="text-slate-400">vs</span> {f.away_team}
                        <TeamLogo name={f.away_team} size="sm" />
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDate(f.match_date)} · {formatTime(f.match_time)}
                      </p>
                      {f.competition_name && (
                        <span className="mt-2 inline-block rounded-full bg-club-gold-100 px-2 py-0.5 text-xs font-semibold text-club-gold-700">
                          {f.competition_name}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Squad line-ups */}
            <section>
              <h2 className="font-display mb-4 text-2xl font-semibold uppercase tracking-wide text-club-ink">Squads &amp; Line-ups</h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {playersByTeam.map(({ team, players }) => (
                  <Link
                    key={team.id}
                    href={`/${team.slug}/players`}
                    className="ekhaya-card p-4"
                  >
                    <p className="font-display text-lg font-semibold uppercase tracking-wide text-club-ink">{team.name}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {players.length} registered player{players.length === 1 ? '' : 's'}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Side column — statistics */}
          <aside className="space-y-8">
            <section className="ekhaya-card p-5">
              <h2 className="font-display mb-4 text-xl font-semibold uppercase tracking-wide text-club-ink">Season Statistics</h2>
              {senior && aggregate.played > 0 ? (
                <>
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-lg bg-[#F7F5F0] p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Played</dt>
                      <dd className="font-display mt-1 text-xl font-semibold text-club-ink">{aggregate.played}</dd>
                    </div>
                    <div className="rounded-lg bg-club-gold-100 p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Wins</dt>
                      <dd className="font-display mt-1 text-xl font-semibold text-club-gold-700">{aggregate.wins}</dd>
                    </div>
                    <div className="rounded-lg bg-[#F7F5F0] p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Draws</dt>
                      <dd className="font-display mt-1 text-xl font-semibold text-club-ink">{aggregate.draws}</dd>
                    </div>
                    <div className="rounded-lg bg-[#FBE7E5] p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Losses</dt>
                      <dd className="font-display mt-1 text-xl font-semibold text-[#c0392b]">{aggregate.losses}</dd>
                    </div>
                    <div className="rounded-lg bg-[#F7F5F0] p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Goals for</dt>
                      <dd className="font-display mt-1 text-xl font-semibold text-club-ink">{aggregate.goalsFor}</dd>
                    </div>
                    <div className="rounded-lg bg-[#F7F5F0] p-3">
                      <dt className="text-xs uppercase tracking-wide text-slate-500">Goals against</dt>
                      <dd className="font-display mt-1 text-xl font-semibold text-club-ink">{aggregate.goalsAgainst}</dd>
                    </div>
                  </dl>
                  {ekhayaStanding && (
                    <p className="mt-4 rounded-lg bg-club-gold-100 px-3 py-2 text-sm font-medium text-club-gold-700">
                      {ekhayaStanding.position}. on the {ekhayaStanding.team_name} league table with{' '}
                      {ekhayaStanding.points} points.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500">No season statistics available yet.</p>
              )}
            </section>

            <section>
              <h2 className="font-display mb-3 text-xl font-semibold uppercase tracking-wide text-club-ink">Form — last 5</h2>
              <div className="flex gap-2">
                {formLast5.length === 0 ? (
                  <p className="text-sm text-slate-500">No recent matches.</p>
                ) : (
                  formLast5.map((r, i) => {
                    const isHome = r.home_team.toLowerCase() === 'ekhaya';
                    const scored = isHome ? r.home_score : r.away_score;
                    const conceded = isHome ? r.away_score : r.home_score;
                    const mark = scored > conceded ? 'W' : scored === conceded ? 'D' : 'L';
                    const cls = mark === 'W' ? 'status-w' : mark === 'D' ? 'status-d' : 'status-l';
                    return (
                      <span
                        key={i}
                        className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${cls}`}
                      >
                        {mark}
                      </span>
                    );
                  })
                )}
              </div>
            </section>

            <section>
              <h2 className="font-display mb-3 text-xl font-semibold uppercase tracking-wide text-club-ink">Top Scorers</h2>
              {topScorers.length === 0 ? (
                <p className="text-sm text-slate-500">No goal data available.</p>
              ) : (
                <div className="space-y-2">
                  {topScorers.map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-club-border bg-white px-3 py-2 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-slate-400">{i + 1}.</span>
                        <span className="font-medium text-club-ink">{p.name}</span>
                      </span>
                      <span className="font-display text-lg font-semibold text-club-gold-700">{p.goals}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="font-display mb-3 text-xl font-semibold uppercase tracking-wide text-club-ink">Top Performers</h2>
              {topPerformers.length === 0 ? (
                <p className="text-sm text-slate-500">No performance data available.</p>
              ) : (
                <div className="space-y-2">
                  {topPerformers.map((p, i) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between rounded-xl border border-club-border bg-white px-3 py-2 text-sm"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-bold text-slate-400">{i + 1}.</span>
                        <span className="font-medium text-club-ink">{p.player_name}</span>
                        <span className="text-xs text-slate-500">({p.competition_name})</span>
                      </span>
                      <span className="font-display font-semibold text-club-gold-700">
                        {p.goals ?? 0}G {p.assists ?? 0}A
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}