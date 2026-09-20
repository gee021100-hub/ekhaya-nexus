import type { Metadata } from 'next';
import { getMediaItems } from '@/lib/data';
import type { MediaItem } from '@/types';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';

export const metadata: Metadata = { title: 'Match Highlights & Media' };

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function MediaCard({ item }: { item: MediaItem }) {
  const isVideo = item.media_type !== 'photo';
  return (
    <div className="overflow-hidden rounded-2xl border border-club-border bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg">
      <div className="aspect-video w-full bg-club-ink">
        {isVideo ? (
          <iframe
            src={item.url}
            title={item.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.url}
            alt={item.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2">
          <span className="gold-pill">{item.media_type}</span>
          <span className="text-xs text-slate-400">{formatDate(item.published_at)}</span>
        </div>
        <h2 className="font-display mt-2 text-lg font-semibold uppercase tracking-wide text-club-ink">{item.title}</h2>
        {!isVideo && item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-club-gold-700 hover:underline"
          >
            View full size →
          </a>
        )}
      </div>
    </div>
  );
}

export default async function MediaPage() {
  const items = await getMediaItems();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Match Highlights &amp; Media"
        subtitle="Relive the best moments — match highlights, videos and photo galleries."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {items.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-club-border bg-white p-14 text-center">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">No media yet</h2>
            <p className="mt-1 text-sm text-slate-500">
              Highlights and photos will be published here after match days.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MediaCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}