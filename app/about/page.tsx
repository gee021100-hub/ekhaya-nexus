import type { Metadata } from 'next';
import Link from 'next/link';
import { getMediaItems, getSponsors, getSiteSettings } from '@/lib/data';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';

export const metadata: Metadata = { title: 'About the Club' };

export default async function AboutPage() {
  const sponsors = await getSponsors();
  const settings = await getSiteSettings();
  const photos = (await getMediaItems()).filter((item) => item.media_type === 'photo');

  const pillars = [
    {
      title: 'Four teams, one club',
      body: 'Senior, Women\u2019s, Reserve and Youth squads all live in one place — standings, results, fixtures and performance data for every side.',
    },
    {
      title: 'Digital for the fans',
      body: 'Live match centre, club news, highlights, match tickets and fan membership are available to supporters online.',
    },
    {
      title: 'Runs on open technology',
      body: 'Built on Next.js and Supabase so the club can grow new features, add data and connect a live database at any time.',
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="About the Club"
        subtitle="The digital home of Ekhaya Football Club — one platform for the players, coaches, staff and fans."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section className="max-w-3xl">
          <h2 className="font-display text-3xl font-semibold uppercase tracking-wide text-club-ink">Ekhaya, in your pocket</h2>
          <p className="mt-3 text-slate-600">
            {settings.about_blurb ||
              'The Ekhaya FC digital platform brings the club together — team info, live match data, news, media, tickets, membership and behind-the-scenes club administration in a single connected system.'}
          </p>
        </section>

        <section className="mt-10">
          <div className="grid gap-4 md:grid-cols-3">
            {pillars.map((pillar) => (
              <div
                key={pillar.title}
                className="ekhaya-card p-6"
              >
                <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-club-ink">{pillar.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{pillar.body}</p>
              </div>
            ))}
          </div>
        </section>

        {sponsors.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display mb-4 text-3xl font-semibold uppercase tracking-wide text-club-ink">
              Supporters &amp; Partners
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="flex flex-col items-center justify-center rounded-2xl border border-club-border bg-white p-6 text-center shadow-sm"
                >
                  {sponsor.logo_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={sponsor.logo_url}
                      alt={`${sponsor.name} logo`}
                      className="mb-3 h-14 w-14 rounded-xl object-contain"
                      loading="lazy"
                    />
                  ) : (
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-xl bg-club-gold-100 text-xl font-black text-club-gold-800">
                      {sponsor.name.charAt(0)}
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-club-ink">{sponsor.name}</h3>
                  <p className="text-xs uppercase tracking-wide text-[#8a8a8a]">{sponsor.level}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="ekhaya-card mt-12 bg-club-gold-50 p-6 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold uppercase tracking-wide text-club-ink">
                Come and see the club
              </h2>
              <p className="mt-1 max-w-xl text-sm text-slate-600">
                Check the fixture list for the next home match, book your ticket and be part of the
                Ekhaya support.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/senior/fixtures" className="btn-gold">
                View fixtures
              </Link>
              <Link href="/tickets" className="btn-outline-gold">
                Buy tickets
              </Link>
            </div>
          </div>
        </section>

        {photos.length > 0 && (
          <section className="mt-12">
            <h2 className="font-display mb-4 text-3xl font-semibold uppercase tracking-wide text-club-ink">From the gallery</h2>
            <Link href="/gallery" className="text-sm font-semibold text-club-gold-700 hover:underline">
              View the full gallery →
            </Link>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}