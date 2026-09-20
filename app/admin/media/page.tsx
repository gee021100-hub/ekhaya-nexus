import type { Metadata } from 'next';
import { getMediaItems } from '@/lib/data';
import { MediaForm } from '@/components/admin/media-form';

export const metadata: Metadata = { title: 'Match Media' };

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function AdminMediaPage() {
  const items = await getMediaItems();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Match Media &amp; Highlights</h2>
        <p className="mt-1 text-sm text-slate-500">
          Add match highlights, videos and photos for the public Media page.
        </p>
      </section>

      <MediaForm />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Media items ({items.length})</h3>
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No media items yet. Use the form above to add highlights or photos.
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <div key={item.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  {item.media_type === 'photo' || item.media_type === 'highlight' ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt={item.title}
                      className="h-24 w-40 rounded-lg border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="flex h-24 w-40 items-center justify-center rounded-lg border border-slate-200 bg-slate-100 text-xs font-semibold text-slate-400">
                      Video
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{item.title}</p>
                    <p className="mt-0.5 break-all text-sm text-slate-500">
                      {item.media_type} · {formatDate(item.published_at)}
                      <br />
                      {item.url}
                    </p>
                  </div>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm font-semibold text-club-green-700 hover:underline"
                  >
                    Open
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}