import type { Metadata, Viewport } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Ekhaya Nexus',
    template: '%s | Ekhaya Nexus',
  },
  description:
    'EKHAYA NEXUS — football team management and statistics for Ekhaya FC. Senior, Women\u2019s, Reserve and Youth team info, standings, results, fixtures and performance. Airtel Top 8 champions.',
  applicationName: 'EKHAYA NEXUS',
  keywords: ['Ekhaya FC', 'football', 'team management', 'Malawi football', 'standings', 'results', 'fixtures', 'Aitel Top 8'],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
  openGraph: {
    title: 'EKHAYA NEXUS',
    description:
      'Football team management & statistics for Ekhaya FC. Airtel Top 8 champions.',
    type: 'website',
    locale: 'en_ZA',
  },
};

export const viewport: Viewport = {
  themeColor: '#254c3b',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} bg-white font-sans text-slate-800 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}