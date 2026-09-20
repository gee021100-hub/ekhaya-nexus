import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNewsArticle } from '@/lib/data';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = await getNewsArticle(id);
  return { title: article?.title ?? 'News' };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getNewsArticle(id);
  if (!article) notFound();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero eyebrow="Ekhaya FC" title={article.title}>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="gold-pill">{article.category}</span>
          <span className="text-xs text-slate-400">{formatDate(article.published_at)}</span>
        </div>
      </PageHero>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
        <article className="prose-lg max-w-none">
          {article.summary && (
            <p className="text-lg font-medium text-slate-600">{article.summary}</p>
          )}
          <div className="mt-4 whitespace-pre-line text-slate-800">{article.content}</div>
        </article>
        <div className="mt-10">
          <Link href="/news" className="text-sm font-semibold text-club-gold-700 hover:underline">
            ← Back to all news
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}