import { NextResponse } from 'next/server';
import { getSiteSettings } from '@/lib/data';

/** Public site settings (contact details, payment wallets) for client pages. */
export async function GET() {
  const settings = await getSiteSettings();
  return NextResponse.json(settings);
}

export const runtime = 'nodejs';