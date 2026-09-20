import { createClient as createSupabaseClient } from '@supabase/supabase-js';

/**
 * Server-only Supabase client using the service-role key. This key can do
 * anything in the project, so it is NEVER imported by client components or
 * route handlers that render in the browser. Used only by server-side
 * diagnostics (lib/telemetry.ts) and health checks.
 */
export function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}