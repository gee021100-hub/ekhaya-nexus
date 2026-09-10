import Link from 'next/link';

export function Brand({ subtitle }: { subtitle?: string }) {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-club-green-700 text-sm font-black text-white">
        EF
      </div>
      <div>
        <span className="block text-lg font-black tracking-tight text-slate-900">
          Ekhaya FC
        </span>
        {subtitle && (
          <span className="block text-xs text-slate-500">{subtitle}</span>
        )}
      </div>
    </Link>
  );
}
