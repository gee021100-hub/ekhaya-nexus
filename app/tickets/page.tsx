import type { Metadata } from 'next';
import Link from 'next/link';
import { getTicketAllocations, getSiteSettings } from '@/lib/data';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';
import { TicketBookingForm } from '@/components/ticket-booking-form';

export const metadata: Metadata = { title: 'Match Tickets' };

function formatDate(date: string | null): string {
  if (!date) return 'Date to be confirmed';
  const d = new Date(`${date}T00:00:00`);
  return d.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default async function TicketsPage() {
  const [allocations, settings] = await Promise.all([getTicketAllocations(), getSiteSettings()]);

  const groups = new Map<
    string,
    {
      fixture_name: string;
      match_date: string | null;
      items: typeof allocations;
    }
  >();
  for (const allocation of allocations) {
    const key = allocation.fixture_id ?? 'general';
    if (!groups.has(key)) {
      groups.set(key, {
        fixture_name: allocation.fixture_name ?? 'General admission',
        match_date: allocation.match_date ?? null,
        items: [],
      });
    }
    groups.get(key)!.items.push(allocation);
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Match Tickets"
        subtitle="Book your seat for Ekhaya FC home matches — choose your stand and secure your place."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {allocations.length === 0 ? (
          <div className="mx-auto max-w-md rounded-2xl border border-dashed border-club-border bg-white p-14 text-center">
            <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">No tickets on sale right now</h2>
            <p className="mt-1 text-sm text-slate-500">
              Ticket sales will open here before each home match. Join the fan membership
              for priority access when tickets go live.
            </p>
            <Link
              href="/membership"
              className="btn-gold mt-5"
            >
              Become a member
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {[...groups.entries()].map(([key, group]) => (
              <section key={key}>
                <div className="mb-4">
                  <h2 className="font-display text-2xl font-semibold uppercase tracking-wide text-club-ink">{group.fixture_name}</h2>
                  <p className="mt-1 text-sm font-medium uppercase tracking-wide text-[#8a8a8a]">{formatDate(group.match_date)}</p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {group.items.map((allocation) => (
                    <TicketBookingForm key={allocation.id} allocation={allocation} settings={settings} />
                  ))}
                </div>
              </section>
            ))}

            <section className="ekhaya-card bg-club-gold-50 p-6">
              <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-club-ink">Match-day information</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>• Collect your tickets at the stadium gate or on your phone at the entry.</li>
                <li>• Gates open two hours before kick-off.</li>
                <li>• Bring a valid photo ID along with your booking reference.</li>
                <li>
                  • Gold and Family members get priority access when ticket sales open.
                </li>
              </ul>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}