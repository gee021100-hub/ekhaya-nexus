import { NextResponse } from 'next/server';
import { adminClient } from '@/lib/supabase/admin';
import { supabaseConfigured } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

/**
 * Database health probe for uptime/availability monitoring. Returns 200 when
 * Supabase is reachable, 503 when it is not (or when diagnostics aren't wired
 * yet). Add this to UptimeRobot alongside /healthz.
 */
export async function GET() {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { status: 'degraded', db: 'not_configured' },
      { status: 503 },
    );
  }

  try {
    const admin = adminClient();
    if (!admin) {
      return NextResponse.json(
        { status: 'degraded', db: 'service_role_missing' },
        { status: 503 },
      );
    }
    // Probe a core table that exists from migration 000006 (head:true on a
    // missing table falsely reports 204, so don't rely on it).
    const { error } = await admin.from('announcements').select('id').limit(1);
    if (error) throw error;
    return NextResponse.json({ status: 'ok', db: 'ok' }, { status: 200 });
  } catch {
    return NextResponse.json({ status: 'degraded', db: 'unreachable' }, { status: 503 });
  }
}