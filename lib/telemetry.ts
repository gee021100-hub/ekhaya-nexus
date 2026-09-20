import { adminClient } from '@/lib/supabase/admin';

export type EventLevel = 'info' | 'warn' | 'error';

type LogOptions = {
  level?: EventLevel;
  scope: string;
  message: string;
  stack?: string;
  path?: string;
  data?: Record<string, unknown>;
};

/**
 * Server-side diagnostics. Writes an app_events row using the service-role
 * client so anonymous users can never inject log entries. Failures to log are
 * swallowed — telemetry must never break the request that caused the error.
 *
 * When Sentry is configured (SENTRY_DSN present), errors are also forwarded
 * to Sentry so captured stack traces land in one place.
 */
export async function logEvent({
  level = 'error',
  scope,
  message,
  stack,
  path,
  data,
}: LogOptions): Promise<void> {
  try {
    const admin = adminClient();
    if (admin) {
      await admin.from('app_events').insert({
        level,
        scope,
        message: message.slice(0, 2000),
        stack: stack ? stack.slice(0, 4000) : null,
        data: data ?? null,
        path: path ? path.slice(0, 300) : null,
      });
    }
  } catch {
    // ignore — telemetry must never throw
  }

  if (level === 'error' && process.env.SENTRY_DSN) {
    try {
      const Sentry = await import('@sentry/nextjs');
      const error = new Error(message);
      if (stack) error.stack = stack;
      Sentry.captureException(error, {
        tags: { scope },
        extra: { path, ...(data ?? {}) },
      });
    } catch {
      // ignore
    }
  }
}

/** Convenience wrapper for error-level entries. */
export async function logError(
  scope: string,
  error: unknown,
  extra?: { path?: string; data?: Record<string, unknown> },
): Promise<void> {
  const message = error instanceof Error ? error.message : String(error ?? 'Unknown error');
  const stack = error instanceof Error ? (error.stack ?? undefined) : undefined;
  await logEvent({
    level: 'error',
    scope,
    message,
    stack,
    path: extra?.path,
    data: extra?.data,
  });
}