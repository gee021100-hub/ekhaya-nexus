import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '') as string;
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '') as string;

/** True when the app has been wired to a Supabase project. */
export function supabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * Server context client bound to the request cookies (RLS via the session).
 * Alias kept because "configured" reads as the redirect/turnstile for auth.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component; safe to ignore when setting from
          // middleware/route handlers only.
        }
      },
    },
  });
}