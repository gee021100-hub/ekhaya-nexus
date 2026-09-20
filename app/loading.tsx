export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-club-gold-100 font-display text-2xl font-semibold text-club-gold-800">
        EF
      </div>
      <div className="h-2 w-48 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-club-gold" />
      </div>
      <p className="mt-4 text-sm text-slate-500">Loading…</p>
    </div>
  );
}