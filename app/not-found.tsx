import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-club-gold-100 font-display text-2xl font-semibold text-club-gold-800">
          EF
        </div>
        <h1 className="font-display text-3xl font-semibold uppercase tracking-wide text-club-ink">Page not found</h1>
        <p className="mt-3 text-slate-600">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            href="/"
            className="rounded-lg bg-club-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-club-green-600"
          >
            Go home
          </Link>
          <Link
            href="/admin"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Administration
          </Link>
        </div>
      </div>
    </div>
  );
}