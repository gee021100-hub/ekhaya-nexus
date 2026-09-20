import { headers } from 'next/headers';

type RateLimitConfig = { limit: number; windowMs: number };

/**
 * Lightweight in-memory sliding window used to throttle the public fan forms
 * and the analytics endpoint. Keys are scoped per action + client IP.
 *
 * This is instance-local (fine for the current single-process deployment);
 * if the app is ever scaled to multiple instances, swap this for a shared
 * store (e.g. a Supabase table or Redis).
 */
const CONFIG: Record<string, RateLimitConfig> = {
  booking: { limit: 6, windowMs: 60_000 },
  membership: { limit: 4, windowMs: 60_000 },
  contact: { limit: 5, windowMs: 60_000 },
  track: { limit: 30, windowMs: 60_000 },
  store: { limit: 5, windowMs: 60_000 },
  poll: { limit: 5, windowMs: 60_000 },
};

const store = new Map<string, { count: number; resetAt: number }>();

function sweep(now: number) {
  for (const [key, bucket] of store) {
    if (bucket.resetAt <= now) store.delete(key);
  }
}

/** Client IP, read from the forwarded headers set by Next/proxies. */
export async function clientIp(): Promise<string> {
  try {
    const h = await headers();
    const fwd = h.get('x-forwarded-for');
    if (fwd) return fwd.split(',')[0].trim();
    return h.get('x-real-ip') ?? 'unknown';
  } catch {
    return 'unknown';
  }
}

/** Returns true when the request is allowed, false when it is rate-limited. */
export async function rateLimit(action: string, ip?: string): Promise<boolean> {
  const cfg = CONFIG[action];
  if (!cfg) return true;

  const client = ip ?? (await clientIp());
  const now = Date.now();
  sweep(now);

  const key = `${action}:${client}`;
  const bucket = store.get(key);

  if (!bucket || bucket.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + cfg.windowMs });
    return true;
  }

  if (bucket.count >= cfg.limit) return false;
  bucket.count += 1;
  return true;
}