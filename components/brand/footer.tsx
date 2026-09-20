import Link from 'next/link';
import { Brand } from '@/components/brand/logo';
import { TEAMS } from '@/types';
import { getSiteSettings } from '@/lib/data';

export async function Footer() {
  const settings = await getSiteSettings();

  const socialLinks = [
    settings.facebook && { label: 'Facebook', href: settings.facebook },
    settings.instagram && { label: 'Instagram', href: settings.instagram },
    settings.x_handle && { label: 'X / Twitter', href: settings.x_handle },
    settings.tiktok && { label: 'TikTok', href: settings.tiktok },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <footer className="bg-[#F3F0E7] pb-0">
      <div className="h-0.5 bg-club-gold" />
      <div className="mx-auto max-w-7xl px-4 py-12 pb-28 sm:px-6 sm:pb-12 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Brand subtitle="Ekhaya App" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-gray-600">
              Football team management and statistics for Ekhaya Football Club — the digital
              home of the Senior, Women&apos;s, Reserve and Youth teams.
            </p>
            {socialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href.startsWith('http') ? social.href : `https://${social.href.replace(/^https?:\/\//, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-club-gold-300 bg-white px-3 py-1.5 text-xs font-semibold text-club-gold-800 transition-all hover:-translate-y-0.5 hover:bg-club-gold-100 hover:shadow-sm"
                  >
                    {social.label}
                  </a>
                ))}
              </div>
            )}
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-club-ink">
              Teams
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              {TEAMS.map((team) => (
                <li key={team.slug}>
                  <Link
                    href={`/${team.slug}`}
                    className="inline-flex items-center gap-1.5 hover:text-club-gold-700"
                  >
                    {team.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-club-ink">
              Digital App
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/match-centre" className="hover:text-club-gold-700">
                  Live match centre
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-club-gold-700">
                  News &amp; announcements
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-club-gold-700">
                  Photo gallery
                </Link>
              </li>
              <li>
                <Link href="/media" className="hover:text-club-gold-700">
                  Highlights &amp; media
                </Link>
              </li>
              <li>
                <Link href="/tickets" className="hover:text-club-gold-700">
                  Match tickets
                </Link>
              </li>
              <li>
                <Link href="/membership" className="hover:text-club-gold-700">
                  Fan membership
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-club-ink">
              The Club
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-600">
              <li>
                <Link href="/about" className="hover:text-club-gold-700">
                  About the club
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-club-gold-700">
                  Contact us
                </Link>
              </li>
              {settings.contact_email && (
                <li>
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-club-gold-700">
                    {settings.contact_email}
                  </a>
                </li>
              )}
              {settings.contact_phone && (
                <li>
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-club-gold-700">
                    {settings.contact_phone}
                  </a>
                </li>
              )}
            </ul>
            <Link href="/admin" className="btn-outline-gold mt-5 text-xs">
              Administration
            </Link>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-club-border pt-6 text-xs text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Ekhaya Football Club. All rights reserved.</p>
          <p>
            EKHAYA APP · <span className="text-club-gold-700">white &amp; gold</span>
          </p>
        </div>
      </div>
    </footer>
  );
}