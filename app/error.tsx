'use client';

import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="mx-auto max-w-md text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-club-gold-100 font-display text-2xl font-semibold text-club-gold-800">
            EF
          </div>
          <h1 className="font-display text-3xl font-semibold uppercase tracking-wide text-club-ink">
            Something went wrong
          </h1>
          <p className="mt-3 text-slate-600">
            An unexpected error occurred while loading this page. Please try again.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              onClick={reset}
              className="rounded-lg bg-club-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-club-green-600"
            >
              Try again
            </button>
            <Link
              href="/"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Go home
            </Link>
          </div>
          {error.digest && (
            <p className="mt-6 text-xs text-slate-400">Error code: {error.digest}</p>
          )}
        </div>
      </body>
    </html>
  );
}