import { cn } from '@/lib/utils';

export function PageHero({
  title,
  subtitle,
  eyebrow,
  center,
  children,
}: {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  center?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <section className="brand-hero-dark px-4 py-14 sm:py-20">
      <div className={cn('relative z-10 mx-auto max-w-7xl', center && 'text-center')}>
        {eyebrow && (
          <p
            className={cn(
              'mb-2 text-xs font-extrabold uppercase tracking-[0.3em] text-club-gold-300',
              center &&
                '-mt-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 backdrop-blur',
            )}
          >
            {eyebrow}
          </p>
        )}
        <h1 className="font-display mt-2 text-4xl font-semibold uppercase tracking-wide text-white sm:text-6xl">
          {title}
        </h1>
        {subtitle && (
          <p
            className={cn(
              'mt-3 max-w-2xl text-sm text-slate-300 sm:text-base',
              center && 'mx-auto',
            )}
          >
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
}