import { NextResponse } from 'next/server';
import { createHash } from 'node:crypto';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';
import { logEvent } from '@/lib/telemetry';

function sha8(value: string): string {
  return createHash('sha256').update(value).digest('hex').slice(0, 8);
}

const DEVICES = new Set(['mobile', 'tablet', 'desktop', 'unknown']);

export async function POST(request: Request) {
  if (!(await rateLimit('track', request.headers.get('x-forwarded-for') ?? 'unknown'))) {
    return new NextResponse(null, { status: 429 });
  }

  let body: {
    path?: unknown;
    referrer?: unknown;
    device?: unknown;
    locale?: unknown;
    viewport?: unknown;
    visitor?: unknown;
  };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  let path = typeof body.path === 'string' ? body.path : '';
  if (!path.startsWith('/') || path.startsWith('/api/') || path.startsWith('/admin')) {
    return new NextResponse(null, { status: 200 }); // ignore admin/internal hits
  }
  path = path.split('?')[0].slice(0, 200);

  const referrer = typeof body.referrer === 'string' ? body.referrer.slice(0, 500) : null;
  const locale = typeof body.locale === 'string' ? body.locale.slice(0, 10) : null;
  const viewport = typeof body.viewport === 'string' ? body.viewport.slice(0, 20) : null;
  const device = typeof body.device === 'string' && DEVICES.has(body.device) ? body.device : 'unknown';
  const visitor = typeof body.visitor === 'string' ? sha8(body.visitor) : null;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('analytics_page_views').insert({
      path,
      referrer,
      device,
      locale,
      viewport,
      visitor,
    });
    if (error) {
      void logEvent({
        level: 'info',
        scope: 'analytics:track',
        message: `Page view not recorded: ${error.message}`,
        path,
      });
    }
  } catch (e) {
    void logEvent({
      level: 'info',
      scope: 'analytics:track',
      message: e instanceof Error ? e.message : 'track failed',
      path,
    });
  }

  return new NextResponse(null, { status: 204 });
}

export const runtime = 'nodejs';