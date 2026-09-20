import Link from 'next/link';
import { TEAMS } from '@/types';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { TeamLogo } from '@/components/brand/team-logo';
import {
  LiveIcon,
  NewsIcon,
  GalleryIcon,
  MediaIcon,
  TicketIcon,
  HeartIcon,
  ShieldIcon,
  TrophyIcon,
  ChevronIcon,
} from '@/components/brand/app-icons';
import {
  getAnnouncements,
  getSponsors,
  getTeamBySlug,
  getFixtures,
  getResults,
  getStandings,
  getPlayers,
} from '@/lib/data';

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function SectionHead({
  kicker,
  title,
  link,
  linkLabel,
}: {
  kicker: string;
  title: string;
  link?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{kicker}</p>
        <h2 className="font-display mt-1 text-3xl font-semibold uppercase leading-tight tracking-wide text-club-ink">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          href={link}
          className="group inline-flex shrink-0 items-center gap-1 text-sm font-bold text-club-gold-700 transition-colors hover:text-club-gold-800"
        >
          {linkLabel ?? 'View all'}
          <ChevronIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

const appModules = [
  {
    title: 'Live Match Centre',
    to: '/match-centre',
    body: 'Scores, results, line-ups and statistics in one place.',
    icon: LiveIcon,
    live: true,
  },
  { title: 'News', to: '/news', body: 'The latest club news and announcements.', icon: NewsIcon },
  {
    title: 'Photo Gallery',
    to: '/gallery',
    body: 'Match-day photos and moments around the club.',
    icon: GalleryIcon,
  },
  {
    title: 'Media & Highlights',
    to: '/media',
    body: 'Match highlights, videos and more.',
    icon: MediaIcon,
  },
  { title: 'Match Tickets', to: '/tickets', body: 'Book your seat for Ekhaya FC home matches.', icon: TicketIcon },
  {
    title: 'Fan Membership',
    to: '/membership',
    body: 'Join the official Ekhaya FC supporter family.',
    icon: HeartIcon,
  },
];

export default async function HomePage() {
  const [announcements, sponsors, team, standings] = await Promise.all([
    getAnnouncements().catch(() => []),
    getSponsors().catch(() => []),
    getTeamBySlug('senior').catch(() => null),
    getStandings().catch(() => []),
  ]);
  const [fixtures, results, players] = team
    ? await Promise.all([
        getFixtures(team.id).catch(() => []),
        getResults(team.id).catch(() => []),
        getPlayers(team.id).catch(() => []),
      ])
    : [[], [], []];

  const today = new Date().toISOString().slice(0, 10);
  const nextMatch = fixtures.find((f) => f.match_date >= today) ?? null;

  const aggregate = results.reduce(
    (acc, r) => {
      const isHome = r.home_team.toLowerCase() === 'ekhaya';
      const scored = isHome ? r.home_score : r.away_score;
      const conceded = isHome ? r.away_score : r.home_score;
      acc.played += 1;
      if (scored > conceded) acc.wins += 1;
      else if (scored === conceded) acc.draws += 1;
      else acc.losses += 1;
      return acc;
    },
    { played: 0, wins: 0, draws: 0, losses: 0 },
  );
  const ekhayaStanding = standings.find((s) => s.team_name.toLowerCase() === 'ekhaya');
  const topScorer = [...players].sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0))[0];

  // League record from the standings table when available (matches played/wins
  // stay consistent with /senior/standings); fall back to all results.
  const played = ekhayaStanding ? ekhayaStanding.played : aggregate.played;
  const wins = ekhayaStanding ? ekhayaStanding.wins : aggregate.wins;

  const stats = [
    { label: 'Matches played', value: played, show: played > 0 || Boolean(ekhayaStanding) },
    { label: 'Wins', value: wins, show: played > 0 || Boolean(ekhayaStanding) },
    {
      label: 'League position',
      value: ekhayaStanding ? `#${ekhayaStanding.position}` : '',
      show: Boolean(ekhayaStanding),
    },
    {
      label: 'Top scorer',
      value: topScorer ? `${topScorer.goals ?? 0} goals` : '',
      show: Boolean(topScorer && (topScorer.goals ?? 0)),
    },
  ].filter((s) => s.show);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />

      {/* Hero */}
      <section className="brand-hero-dark">
        <div className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-16 text-center sm:pb-24 sm:pt-20">
          <span className="relative mx-auto mb-7 flex h-24 w-24 sm:h-28 sm:w-28">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/branding/ekhaya-logo.jpg"
              alt="Ekhaya FC crest"
              className="ekhaya-fade relative z-10 h-full w-full rounded-full bg-white object-contain p-1.5 shadow-2xl ring-4 ring-club-gold-400"
            />
            <span className="absolute -inset-2.5 rounded-full border border-club-gold-300/40" aria-hidden />
          </span>
          <p className="ekhaya-fade ekhaya-fade-delay-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.28em] text-club-gold-300 backdrop-blur">
            <TrophyIcon className="h-3.5 w-3.5" />
            Airtel Top 8 champions
          </p>
          <h1 className="ekhaya-fade ekhaya-fade-delay-1 font-display mt-5 text-5xl font-semibold uppercase tracking-wide text-white sm:text-7xl">
            EKHAYA <span className="text-gold-gradient">FC</span>
          </h1>
          <p className="ekhaya-fade ekhaya-fade-delay-2 mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
            The digital home of Ekhaya Football Club — Senior, Women&apos;s, Reserve and Youth
            team info, live match centre, news, media, tickets and fan membership.
          </p>
          <div className="ekhaya-fade ekhaya-fade-delay-2 mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/match-centre" className="btn-gold">
              <LiveIcon className="h-4 w-4" />
              Live match centre
            </Link>
            <Link href="/tickets" className="btn-outline-light">
              <TicketIcon className="h-4 w-4" />
              Book tickets
            </Link>
          </div>

          {nextMatch && (
            <div className="ekhaya-fade ekhaya-fade-delay-3 mx-auto mt-12 max-w-2xl">
              <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.28em] text-club-gold-300">
                Next match
              </p>
              <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.06] p-6 shadow-2xl shadow-black/40 backdrop-blur-md">
                <div className="grid gap-6 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
                  <div className="flex flex-col items-center gap-2">
                    <TeamLogo name={nextMatch.home_team} size="2xl" />
                    <span className="text-sm font-bold text-white">{nextMatch.home_team}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">
                      vs
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <TeamLogo name={nextMatch.away_team} size="2xl" />
                    <span className="text-sm font-bold text-white">{nextMatch.away_team}</span>
                  </div>
                </div>
                <p className="mt-6 text-sm text-slate-300">
                  {formatDate(nextMatch.match_date)}
                  {nextMatch.match_time ? ` · ${nextMatch.match_time.slice(0, 5)}` : ''}
                  {nextMatch.competition_name ? (
                    <span className="ml-2 rounded-full bg-club-gold-300 px-2.5 py-0.5 text-xs font-extrabold text-club-gold-900">
                      {nextMatch.competition_name}
                    </span>
                  ) : null}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                  <Link href="/tickets" className="btn-gold">
                    <TicketIcon className="h-4 w-4" />
                    Book tickets
                  </Link>
                  <Link href="/match-centre" className="btn-outline-light">
                    Match centre
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Stats band */}
      {stats.length > 0 && (
        <section className="border-y border-black/20 bg-club-ink px-4 py-10">
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl font-semibold text-club-gold-300 sm:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Announcements */}
      {announcements.length > 0 && (
        <section className="px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHead kicker="Club announcements" title="What's happening" link="/news" linkLabel="All news" />
            <div className="grid gap-4 md:grid-cols-2">
              {announcements.slice(0, 4).map((item) => (
                <div key={item.id} className="ekhaya-card p-6">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-club-gold-100 px-2.5 py-0.5 font-bold uppercase tracking-wide text-club-gold-800">
                      {item.type}
                    </span>
                    {item.is_pinned && (
                      <span className="rounded-full bg-club-ink px-2.5 py-0.5 font-bold text-white">
                        Pinned
                      </span>
                    )}
                    <span className="text-slate-400">{formatDate(item.published_at)}</span>
                  </div>
                  <h3 className="font-display mt-3 text-lg font-semibold uppercase tracking-wide text-club-ink">{item.title}</h3>
                  {item.body && <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{item.body}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Digital app links */}
      <section className="border-y border-slate-200 bg-slate-50 px-4 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            kicker="Ekhaya FC Digital"
            title="Everything the club, one app"
            link="/match-centre"
            linkLabel="Open"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {appModules.map((module) => (
              <Link
                key={module.to}
                href={module.to}
                className="group ekhaya-card flex flex-col p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-club-gold-100 text-club-gold-800 shadow-sm transition-colors group-hover:bg-club-gold group-hover:text-club-ink">
                    <module.icon className="h-6 w-6" />
                  </span>
                  {'live' in module && module.live && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-club-gold px-2.5 py-1 text-xs font-extrabold text-club-ink">
                      <span className="live-dot" aria-hidden />
                      LIVE
                    </span>
                  )}
                </div>
                <div className="mt-4 flex-1">
                  <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-club-ink transition-colors group-hover:text-club-gold-800">
                    {module.title}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{module.body}</p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-club-gold-700">
                  Open
                  <ChevronIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Team cards */}
      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:py-20">
        <SectionHead kicker="Our teams" title="Four teams. One club." link="/senior" linkLabel="Explore" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAMS.map((teamConfig) => (
            <Link
              key={teamConfig.slug}
              href={`/${teamConfig.slug}`}
              className="group ekhaya-card flex flex-col p-6"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-club-gold-100 text-club-gold-800 shadow-sm transition-colors group-hover:bg-club-gold group-hover:text-club-ink">
                <ShieldIcon className="h-7 w-7" />
              </span>
              <h3 className="font-display mt-5 text-xl font-semibold uppercase tracking-wide text-club-ink transition-colors group-hover:text-club-gold-800">
                {teamConfig.name}
              </h3>
              <p className="mt-1 text-sm text-slate-500">{teamConfig.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {teamConfig.hasStandings && (
                  <span className="rounded-full bg-club-gold-50 px-2.5 py-0.5 text-xs font-semibold text-club-gold-800">
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
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-club-gold-700">
                View team
                <ChevronIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Sponsors */}
      {sponsors.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50 px-4 py-14">
          <div className="mx-auto max-w-6xl">
            <p className="eyebrow text-center">Proudly supported by</p>
            <h2 className="font-display mt-2 mb-8 text-center text-3xl font-semibold uppercase tracking-wide text-club-ink">
              Supporters &amp; Partners
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="ekhaya-card flex flex-col items-center justify-center p-5 text-center"
                >
                  {sponsor.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sponsor.logo_url}
                      alt={`${sponsor.name} logo`}
                      className="mb-2 h-12 w-12 rounded-xl object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-club-gold-100 text-lg font-black text-club-gold-800">
                      {sponsor.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-slate-900">{sponsor.name}</h3>
                  <p className="text-xs text-slate-500">{sponsor.level}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Membership CTA */}
      <section className="brand-hero-dark px-4 py-16 text-center sm:py-20">
        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.28em] text-club-gold-300 backdrop-blur">
            <HeartIcon className="h-3.5 w-3.5" />
            Join the family
          </p>
          <h2 className="font-display mt-3 text-4xl font-semibold uppercase tracking-wide text-white sm:text-5xl">
            Become an Ekhaya FC member
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-slate-300 sm:text-base">
            Priority tickets, the Gold member match-day stand, members-only competitions and
            exclusive club content.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/membership" className="btn-gold">
              <HeartIcon className="h-4 w-4" />
              Choose your membership
            </Link>
            <Link href="/contact" className="btn-outline-light">
              Contact the club
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