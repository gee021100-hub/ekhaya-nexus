import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import type { User } from '@supabase/supabase-js';

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '') as string;
const supabaseAnonKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '') as string;

const AUTH_TOKEN_RE = /^sb-.+-auth-token$/;

/**
 * Per-process cache of verified staff sessions so bursts of parallel admin
 * requests (route prefetches from the admin layout) don't each hit the Auth
 * API. Tokens are still verified through getUser(); we only remember the
 * answer for 60 seconds. The cache key is the raw auth cookie value.
 */
const sessionCache = new Map<string, { user: User | null; expires: number }>();
const SESSION_CACHE_TTL = 60_000;
const SESSION_CACHE_MAX = 200;

function cachedOrNull(cookie: string): User | null | undefined {
  const hit = sessionCache.get(cookie);
  return hit && hit.expires > Date.now() ? hit.user : undefined;
}

function cacheUser(cookie: string, user: User | null): void {
  if (sessionCache.size >= SESSION_CACHE_MAX) {
    const oldest = sessionCache.keys().next().value;
    if (oldest) sessionCache.delete(oldest);
  }
  sessionCache.set(cookie, { user, expires: Date.now() + SESSION_CACHE_TTL });
}

/**
 * Locks down the administration area behind Supabase Auth. When the app is
 * not connected to a Supabase project (fallback mode), the middleware stands
 * aside so the admin area can still be explored with in-memory data.
 */
export async function middleware(request: NextRequest) {
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  const authCookie = request.cookies
    .getAll()
    .find((c) => AUTH_TOKEN_RE.test(c.name))
    ?.value;

  let user: User | null = null;
  if (authCookie) {
    const cached = cachedOrNull(authCookie);
    if (cached !== undefined) {
      user = cached;
    } else {
      let response = NextResponse.next({ request });
      const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          },
        },
      });
      const {
        data: { user: verified },
      } = await supabase.auth.getUser();
      user = verified;
      cacheUser(authCookie, verified);
    }
  }

  const { pathname } = request.nextUrl;

  if (user && pathname === '/admin/login') {
    const dashboard = request.nextUrl.clone();
    dashboard.pathname = '/admin';
    return NextResponse.redirect(dashboard);
  }

  if (!user && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const login = request.nextUrl.clone();
    login.pathname = '/admin/login';
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: ['/admin/:path*'],
};