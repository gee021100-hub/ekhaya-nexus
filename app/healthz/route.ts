import { NextResponse } from 'next/server';
import { supabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Liveness probe for uptime monitoring. Returns 200 as long as the app is
 * serving. For a database check use /healthz/db (503 when the DB is down).
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'ekhaya-app',
      time: new Date().toISOString(),
      db: supabaseConfigured() ? 'configured' : 'not_configured',
    },
    { status: 200 },
  );
}