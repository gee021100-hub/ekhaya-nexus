import type { Metadata } from 'next';
import Link from 'next/link';
import { getNewsArticles } from '@/lib/data';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';

export const metadata: Metadata = { title: 'News & Announcements' };

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function NewsPage() {
  const articles = await getNewsArticles();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Ekhaya FC News"
        subtitle="Club news, match reports, transfer updates and community announcements."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {articles.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-club-border bg-white p-14 text-center">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">No news yet</h2>
            <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
              Check back soon for the latest updates from Ekhaya FC. News will appear
              here as the club publishes them.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/news/${article.id}`}
                className="group ekhaya-card flex flex-col p-6"
              >
                <div className="mb-4 flex items-center gap-2">
                  <span className="rounded-full bg-club-gold-100 px-2.5 py-0.5 text-xs font-semibold text-club-gold-700">
                    {article.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatDate(article.published_at)}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-semibold uppercase leading-snug tracking-wide text-club-ink transition-colors group-hover:text-club-gold-700">
                  {article.title}
                </h2>
                {article.summary && (
                  <p className="mt-2 flex-1 line-clamp-3 text-sm text-slate-500">{article.summary}</p>
                )}
                <p className="mt-4 text-sm font-semibold text-club-gold-700">
                  Read more →
                </p>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}