import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';
import { ContactForm } from '@/components/contact-form';

export const metadata: Metadata = { title: 'Contact the Club' };

export default async function ContactPage() {
  const settings = await getSiteSettings();

  const details = [
    { label: 'Email', value: settings.contact_email, href: settings.contact_email ? `mailto:${settings.contact_email}` : undefined },
    { label: 'Phone', value: settings.contact_phone, href: settings.contact_phone ? `tel:${settings.contact_phone}` : undefined },
    { label: 'Club address', value: settings.contact_address },
    { label: 'Home stadium', value: settings.stadium_name },
  ].filter((item) => item.value);

  const socials = [
    { label: 'Facebook', value: settings.facebook, href: settings.facebook ? `https://${settings.facebook.replace(/^https?:\/\//, '')}` : undefined },
    { label: 'Instagram', value: settings.instagram, href: settings.instagram ? `https://${settings.instagram.replace(/^https?:\/\//, '')}` : undefined },
    { label: 'X / Twitter', value: settings.x_handle, href: settings.x_handle ? `https://x.com/${settings.x_handle.replace(/^@/, '')}` : undefined },
    { label: 'TikTok', value: settings.tiktok, href: settings.tiktok ? `https://${settings.tiktok.replace(/^https?:\/\//, '')}` : undefined },
  ].filter((item) => item.value !== null) as {
    label: string;
    value: string;
    href?: string;
  }[];

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Contact the Club"
        subtitle="Questions about tickets, membership, sponsorship or the club itself — reach out and we will get back to you."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-2">
            {details.length > 0 && (
              <section className="ekhaya-card p-6">
                <h2 className="font-display mb-4 text-xl font-semibold uppercase tracking-wide text-club-ink">Contact details</h2>
                <dl className="space-y-3 text-sm">
                  {details.map((item) => (
                    <div key={item.label}>
                      <dt className="text-xs font-semibold uppercase tracking-wide text-club-gold-700">
                        {item.label}
                      </dt>
                      <dd className="mt-0.5">
                        {item.href ? (
                          <a href={item.href} className="font-semibold text-slate-700 hover:text-club-gold-700">
                            {item.value}
                          </a>
                        ) : (
                          <span className="font-semibold text-slate-700">{item.value}</span>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            {socials.length > 0 && (
              <section className="ekhaya-card p-6">
                <h2 className="font-display mb-4 text-xl font-semibold uppercase tracking-wide text-club-ink">Follow Ekhaya FC</h2>
                <ul className="space-y-2 text-sm">
                  {socials.map((social) => (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-slate-700 transition-colors hover:text-club-gold-700"
                      >
                        {social.label} — {social.value.replace(/^https?:\/\//, '')}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {settings.ticket_office && (
              <section className="rounded-2xl border border-club-gold bg-club-gold-50 p-6">
                <h2 className="font-display mb-2 text-xl font-semibold uppercase tracking-wide text-club-ink">Ticket office</h2>
                <p className="text-sm text-slate-600">{settings.ticket_office}</p>
              </section>
            )}
          </div>

          <div className="lg:col-span-3">
            <ContactForm />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}