import Link from 'next/link';
import { TIER_DEFINITIONS } from '@/lib/memberships/tiers';
import { formatMoney } from '@/lib/utils';

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-4">
        Membership tiers
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        Every member gets a member number, a digital card and access to club benefits. Higher tiers unlock more. You can upgrade any time.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIER_DEFINITIONS.map((tier) => (
          <div
            key={tier.code}
            className="rounded-2xl border p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <h2 className="text-lg font-bold text-slate-900">{tier.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{tier.tagline}</p>
            <p className="mt-4 text-2xl font-extrabold text-club-gold-700">
              {formatMoney(tier.priceMwk)}
              <span className="text-sm font-medium text-slate-400">
                {tier.periodLabel}
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-2 text-sm text-slate-700">
              {tier.benefits.map((b) => (
                <li key={b} className="flex gap-2">
                  <span className="text-club-gold-600">✓</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <Link
              href={`/join?tier=${tier.code}`}
              className="mt-4 inline-block text-sm font-semibold text-club-gold-700 hover:text-club-gold-800"
            >
              Join {tier.name} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}