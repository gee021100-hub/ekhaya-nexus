import type { Metadata } from 'next';
import { getSponsors } from '@/lib/data';
import { SponsorForm } from '@/components/admin/sponsor-form';
import { DeleteButton } from '@/components/admin/delete-button';
import { deleteSponsor } from '@/app/admin/actions';

export const metadata: Metadata = { title: 'Sponsors & Partners' };

export default async function AdminSponsorsPage() {
  const sponsors = await getSponsors();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Sponsors &amp; Partners</h2>
        <p className="mt-1 text-sm text-slate-500">
          Supporters shown on the home page and About page.
        </p>
      </section>

      <SponsorForm />

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Listed ({sponsors.length})</h3>
        {sponsors.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No sponsors listed yet. Add the first one above.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sponsors.map((sponsor) => (
              <div
                key={sponsor.id}
                className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-slate-900">{sponsor.name}</h4>
                    <p className="text-sm text-slate-500">{sponsor.level}</p>
                  </div>
                  <DeleteButton action={deleteSponsor} id={sponsor.id} />
                </div>
                {sponsor.description && (
                  <p className="mt-3 text-sm text-slate-600">{sponsor.description}</p>
                )}
                {sponsor.website && (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 text-sm font-semibold text-club-gold-700 hover:underline"
                  >
                    Visit website →
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}