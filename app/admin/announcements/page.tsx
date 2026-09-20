import type { Metadata } from 'next';
import { getAnnouncements } from '@/lib/data';
import { AnnouncementForm } from '@/components/admin/announcement-form';
import { DeleteButton } from '@/components/admin/delete-button';
import { deleteAnnouncement } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Announcements' };

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default async function AdminAnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Announcements</h2>
        <p className="mt-1 text-sm text-slate-500">
          Short club updates shown on the home page for fans.
        </p>
      </section>

      <AnnouncementForm />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Published ({announcements.length})</h3>
        {announcements.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No announcements yet. Use the form above to publish the first one.
          </div>
        ) : (
          <div className="grid gap-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-start justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-slate-900">{item.title}</h4>
                    {item.is_pinned && (
                      <span className="rounded-full bg-club-gold-100 px-2.5 py-0.5 text-xs font-semibold text-club-gold-800">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {item.type} · {formatDate(item.published_at)}
                  </p>
                  {item.body && <p className="mt-2 text-sm text-slate-600">{item.body}</p>}
                </div>
                <DeleteButton action={deleteAnnouncement} id={item.id} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}