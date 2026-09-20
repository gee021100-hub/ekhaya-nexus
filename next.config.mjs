import { withSentryConfig } from '@sentry/nextjs';

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.supabase.co https://*.googleusercontent.com https://static.freepik.com https://images.unsplash.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.sentry.io https://api.resend.com",
  "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://www.facebook.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self' https://*.trycloudflare.com",
].join('; ');

// Note on `'unsafe-inline'`: Next.js App Router embeds the React Server
// Components payload in inline scripts, so a fully nonce/hash-based script
// policy would need the upstream proxy to supply per-request nonces. Until
// then the inline allowance keeps hydration working while default-src/object-
// src/base-uri/frame-src still contain the blast radius.

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), payment=()',
  },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000' },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  allowedDevOrigins: ['localhost', '127.0.0.1', '10.156.116.122', '*.local'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers:
          process.env.NODE_ENV === 'production'
            ? [...securityHeaders, { key: 'Content-Security-Policy', value: CSP }]
            : securityHeaders,
      },
    ];
  },
};

// The Sentry webpack integration is applied only when a DSN is configured so
// builds can run without Sentry (no credentials, no noise).
const hasSentryDsn = Boolean(
  process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN,
);

export default hasSentryDsn
  ? withSentryConfig(nextConfig, {
      org: '',
      project: '',
      silent: true,
      widenClientFileUpload: true,
      telemetry: false,
    })
  : nextConfig;