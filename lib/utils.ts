import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format MWK money with thousands separators. */
export function formatMoney(amount: number | string | null | undefined, currency = 'MWK'): string {
  const value = Number(amount ?? 0);
  const formatted = value.toLocaleString('en-MW', { maximumFractionDigits: 2 });
  if (!currency || currency === 'MWK') return `MK ${formatted}`;
  return `${currency} ${formatted}`;
}