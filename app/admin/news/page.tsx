import type { Metadata } from 'next';
import Link from 'next/link';
import { getNewsArticles } from '@/lib/data';
import { NewsForm } from '@/components/admin/news-form';

export const metadata: Metadata = { title: 'News & Announcements' };

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function AdminNewsPage() {
  const articles = await getNewsArticles();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">News &amp; Announcements</h2>
        <p className="mt-1 text-sm text-slate-500">
          Publish club news that appears on the public News page.
        </p>
      </section>

      <NewsForm />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Published articles ({articles.length})</h3>
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No news published yet. Use the form above to create the first article.
          </div>
        ) : (
          <div className="grid gap-4">
            {articles.map((article) => (
              <div key={article.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <Link
                      href={`/news/${article.id}`}
                      className="font-bold text-slate-900 hover:text-club-green-700"
                    >
                      {article.title}
                    </Link>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {article.category} · {formatDate(article.published_at)}
                      {article.summary ? ` — ${article.summary}` : ''}
                    </p>
                  </div>
                  <Link
                    href={`/news/${article.id}`}
                    className="text-sm font-semibold text-club-green-700 hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}