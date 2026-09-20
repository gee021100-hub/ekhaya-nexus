import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';
import { createClient, supabaseConfigured } from '@/lib/supabase/server';
import { signOutAdmin } from '@/app/admin/actions';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let userEmail: string | null = null;
  if (supabaseConfigured()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    userEmail = data.user?.email ?? null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="brand-hero px-4 py-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">Administration</h1>
            <p className="text-sm text-slate-600">
              Registrations, transfers, budgets, petty cash, staff, training, news, media, tickets and reports.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {userEmail ? (
              <form action={signOutAdmin}>
                <button
                  type="submit"
                  className="rounded-lg border border-club-gold-300 px-3 py-1.5 text-sm font-semibold text-club-gold-800 transition-colors hover:bg-club-gold-100"
                >
                  Sign out · {userEmail}
                </button>
              </form>
            ) : (
              <Link
                href="/admin/login"
                className="rounded-lg border border-club-gold-300 px-3 py-1.5 text-sm font-semibold text-club-gold-800 transition-colors hover:bg-club-gold-100"
              >
                Sign in
              </Link>
            )}
            <Link
              href="/"
              className="rounded-lg border border-club-gold-300 px-3 py-1.5 text-sm font-semibold text-club-gold-800 transition-colors hover:bg-club-gold-100"
            >
              Back to site
            </Link>
          </div>
        </div>
      </header>
      <AdminNav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Ekhaya Football Club — Administration
      </footer>
    </div>
  );
}