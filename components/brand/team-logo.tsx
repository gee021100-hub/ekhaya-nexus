import { cn } from '@/lib/utils';
import { teamLogoSrc } from '@/lib/logos';

const SIZE_CLASSES = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2xl': 'h-24 w-24',
} as const;

const FALLBACK_WIDTH = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-2xl',
  '2xl': 'text-4xl',
} as const;

export function TeamLogo({
  name,
  size = 'md',
  className,
}: {
  name: string;
  size?: keyof typeof SIZE_CLASSES;
  className?: string;
}) {
  const src = teamLogoSrc(name);

  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-club-gold-200',
        SIZE_CLASSES[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={`${name} crest`}
          className="h-full w-full object-contain p-0.5"
          loading="lazy"
        />
      ) : (
        <span className={cn('font-bold text-club-gold-700', FALLBACK_WIDTH[size])}>
          {name.charAt(0)}
        </span>
      )}
    </span>
  );
}