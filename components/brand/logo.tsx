import Link from 'next/link';

export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/branding/ekhaya-logo.jpg"
        alt="Ekhaya FC crest"
        className="h-10 w-10 rounded-full bg-white object-contain p-0.5 ring-2 ring-club-gold-300"
      />
      <div className="leading-tight">
        <span className="font-display block text-xl font-semibold uppercase tracking-wide text-club-ink">
          Ekhaya FC
        </span>
        {subtitle && (
          <span className="block text-xs font-medium text-club-gold-700">{subtitle}</span>
        )}
      </div>
    </Link>
  );
}