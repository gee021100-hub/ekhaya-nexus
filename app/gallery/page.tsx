import type { Metadata } from 'next';
import Link from 'next/link';
import { getMediaItems } from '@/lib/data';
import type { MediaItem } from '@/types';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';

export const metadata: Metadata = { title: 'Photo Gallery' };

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function GalleryPage() {
  const photos = (await getMediaItems()).filter((item) => item.media_type === 'photo');

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Photo Gallery"
        subtitle="Match days, celebrations and moments from around the club."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        {photos.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-club-border bg-white p-14 text-center">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">No photos yet</h2>
            <p className="mt-1 text-sm text-slate-500">
              Photographs will appear here after match days. Newest first.
            </p>
            <Link
              href="/media"
              className="mt-5 inline-block text-sm font-semibold text-club-gold-700 hover:underline"
            >
              See highlights &amp; videos →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo: MediaItem, index: number) => {
              const priority = index < 2;
              return (
                <a
                  key={photo.id}
                  href={photo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden rounded-2xl bg-slate-100 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-club-gold-500"
                >
                  <div className="aspect-square w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading={priority ? 'eager' : 'lazy'}
                    />
                  </div>
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                    <p className="truncate text-sm font-semibold text-white">{photo.title}</p>
                    <p className="text-xs text-white/70">{formatDate(photo.published_at)}</p>
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}