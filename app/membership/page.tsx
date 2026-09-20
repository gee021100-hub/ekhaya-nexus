import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';
import { MEMBERSHIP_TIERS } from '@/types';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';
import { MembershipForm } from '@/components/membership-form';
import { cn } from '@/lib/utils';

export const metadata: Metadata = { title: 'Fan Membership' };

export default async function MembershipPage() {
  const settings = await getSiteSettings();
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Join the Ekhaya FC Family"
        subtitle="Become an official Ekhaya FC member and get closer to the club — match access, priority tickets, exclusive content and more."
        center
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section>
          <h2 className="font-display mb-6 text-3xl font-semibold uppercase tracking-wide text-club-ink">
            Choose your membership
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {MEMBERSHIP_TIERS.map((tier) => (
              <div
                key={tier.slug}
                className={cn(
                  'relative flex flex-col rounded-2xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-md',
                  tier.featured
                    ? 'border border-club-gold bg-club-ink text-white shadow-lg'
                    : 'border border-club-border bg-white text-slate-900',
                )}
              >
                {tier.featured && (
                  <span className="font-display absolute -top-3 right-4 rounded-full bg-club-gold px-3 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-club-ink shadow-sm">
                    Most popular
                  </span>
                )}
                <h3 className={cn('mt-2 text-lg font-bold', tier.featured ? 'text-white' : 'text-slate-900')}>{tier.name}</h3>
                <p className="font-display mt-1 text-2xl font-semibold text-club-gold">{tier.price}</p>
                <p className={cn('mt-3 text-sm', tier.featured ? 'text-white/70' : 'text-slate-500')}>{tier.description}</p>
                <ul className={cn('mt-4 space-y-2 text-sm', tier.featured ? 'text-white/85' : 'text-slate-700')}>
                  {tier.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2">
                      <span className="mt-0.5 font-bold text-club-gold">✓</span>
                      {benefit}
                    </li>
                  ))}
                </ul>
                {tier.featured && (
                  <p className="mt-5 rounded-lg border border-club-gold/40 bg-club-gold/10 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.14em] text-club-gold">
                    Official member benefits
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-xl">
          <MembershipForm settings={settings} />
          <p className="mt-4 text-center text-xs text-slate-400">
            By joining you agree to receive Ekhaya FC club updates. Your details are used
            only for club communications and are never shared.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}