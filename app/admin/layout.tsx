import Link from 'next/link';
import { AdminNav } from '@/components/admin/admin-nav';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="border-b border-slate-200 bg-club-green-700 px-4 py-6 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">Administration</h1>
            <p className="text-sm text-white/70">
              Registrations, transfers, budgets, petty cash, staff and training.
            </p>
          </div>
          <Link
            href="/"
            className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            Back to site
          </Link>
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