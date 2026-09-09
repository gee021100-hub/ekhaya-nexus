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

/** Compact "how long ago" for feeds. */
export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}