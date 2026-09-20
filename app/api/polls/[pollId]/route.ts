import { NextResponse } from 'next/server';
import { getPollResults } from '@/lib/data';

/** Running results for a single poll (public read through the RPC). */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ pollId: string }> },
) {
  const { pollId } = await params;
  if (!pollId || pollId.length !== 36) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await getPollResults(pollId);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ results: [] });
  }
}

export const runtime = 'nodejs';