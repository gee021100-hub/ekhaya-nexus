import Link from 'next/link';
import { Brand } from '@/components/brand/logo';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Brand subtitle="Fan Membership" />
            <p className="mt-3 max-w-xs text-sm text-slate-500">
              The official membership platform for Ekhaya Football Club supporters.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Membership</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/pricing" className="hover:text-club-gold-700">
                  Choose a tier
                </Link>
              </li>
              <li>
                <Link href="/join" className="hover:text-club-gold-700">
                  Join the club
                </Link>
              </li>
              <li>
                <Link href="/sign-in" className="hover:text-club-gold-700">
                  Member sign in
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-900">Support</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <Link href="/#faq" className="hover:text-club-gold-700">
                  Frequently asked questions
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-club-gold-700">
                  How payment works
                </Link>
              </li>
              <li>
                <Link href="mailto:members@ekhaya-fc.mw" className="hover:text-club-gold-700">
                  members@ekhaya-fc.mw
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