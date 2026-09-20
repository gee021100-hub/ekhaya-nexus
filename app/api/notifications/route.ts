import { NextResponse } from 'next/server';
import { getFanNotifications } from '@/lib/data';

/** Enabled club notifications for the fan notification tray (public read). */
export async function GET() {
  try {
    const all = await getFanNotifications();
    const enabled = all
      .filter((n) => n.enabled)
      .slice(0, 50)
      .map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        category: n.category,
        published_at: n.published_at,
      }));
    return NextResponse.json({ notifications: enabled });
  } catch {
    return NextResponse.json({ notifications: [] });
  }
}

export const runtime = 'nodejs';