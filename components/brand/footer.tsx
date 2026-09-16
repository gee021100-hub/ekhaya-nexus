import Link from 'next/link';
import { Brand } from '@/components/brand/logo';
import { TEAMS } from '@/types';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Brand subtitle="Ekhaya Nexus" />
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              Football team management and statistics for Ekhaya Football Club.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Teams</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              {TEAMS.map((team) => (
                <li key={team.slug}>
                  <Link href={`/${team.slug}`} className="hover:text-club-green-700">
                    {team.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Administration</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/admin" className="hover:text-club-green-700">
                  Administration dashboard
                </Link>
              </li>
              <li>
                <Link href="/admin/players" className="hover:text-club-green-700">
                  Player registration
                </Link>
              </li>
              <li>
                <Link href="/admin/budget" className="hover:text-club-green-700">
                  Weekly budget
                </Link>
              </li>
              <li>
                <Link href="mailto:info@ekhaya-fc.mw" className="hover:text-club-green-700">
                  info@ekhaya-fc.mw
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-6 text-center text-xs text-slate-400">
          &copy; {new Date().getFullYear()} Ekhaya Football Club. All rights reserved.
        </div>
      </div>
    </footer>
  );
}