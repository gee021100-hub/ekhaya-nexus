import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * RFC 9116 security.txt — tells researchers how to report vulnerabilities.
 * Canonical is derived from the request so it always matches the host the
 * visitor reached the app through (localhost, LAN IP, tunnel, or a domain).
 */
export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const body = [
    'Contact: mailto:security@ekhayafc.app',
    `Contact: ${origin}/contact`,
    'Preferred-Languages: en',
    `Canonical: ${origin}/.well-known/security.txt`,
    'Policy: https://www.nist.gov/news-events/cybersecurity-framework',
    'Expires: 2027-09-20T00:00:00.000Z',
    '',
  ].join('\n');

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}