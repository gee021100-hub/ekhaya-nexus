import type { Metadata } from 'next';
import Link from 'next/link';
import { getStoreProducts, getSiteSettings } from '@/lib/data';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';
import { ProductCard } from '@/components/store/product-card';
import { STORE_CATEGORIES } from '@/types';

export const metadata: Metadata = { title: 'Official Store' };

export default async function StorePage() {
  const [products, settings] = await Promise.all([getStoreProducts(), getSiteSettings()]);
  const enabled = products.filter((p) => p.enabled);

  const groups = STORE_CATEGORIES.map((category) => ({
    category,
    items: enabled.filter((p) => p.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Official Store"
        subtitle="Official Ekhaya FC merchandise — kits, training wear, fashion and collectibles. Pick up from the club shop on match days."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {enabled.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-club-border bg-white p-14 text-center">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">
              The store is being stocked
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Official Ekhaya FC merchandise is coming soon. Follow the club news for the
              launch of the new season range.
            </p>
            <Link href="/news" className="btn-gold mt-5">
              Latest club news
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {groups.map((group) => (
              <section key={group.category}>
                <h2 className="font-display mb-4 text-2xl font-semibold uppercase tracking-wide text-club-ink">
                  {group.category}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {group.items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            ))}

            <section className="ekhaya-card bg-club-gold-50 p-6">
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-club-ink">
                Collection &amp; ordering
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• Your order is held for collection at your chosen pick-up point.</li>
                <li>• Kits can be personalised with a player name and squad number.</li>
                <li>
                  • Pay by mobile money at checkout — quote your order reference at the till.
                </li>
                {settings.contact_phone && (
                  <li>• Questions? Contact the club shop on {settings.contact_phone}.</li>
                )}
              </ul>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}