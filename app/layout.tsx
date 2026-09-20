import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { PwaRegister } from '@/components/pwa-register';
import { PageViewTracker } from '@/components/page-view-tracker';
import { StoreCartProvider } from '@/components/store/cart-context';
import { CartDrawer } from '@/components/store/cart-drawer';
import { NotificationsProvider } from '@/components/notifications/notifications-provider';
import './globals.css';

const oswald = localFont({
  src: './fonts/oswald-latin-var.woff2',
  weight: '200 700',
  variable: '--font-oswald',
  display: 'swap',
});

const inter = localFont({
  src: './fonts/inter-latin-var.woff2',
  weight: '100 900',
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ekhaya FC Digital App',
    template: '%s | Ekhaya FC Digital App',
  },
  description:
    'EKHAYA FC — the digital home of Ekhaya Football Club. Live match centre, fixtures, results, standings, player & team performance, news, highlights, tickets, fan membership and more.',
  applicationName: 'EKHAYA FC DIGITAL APP',
  keywords: ['Ekhaya FC', 'Ekhaya', 'football', 'Malawi football', 'FDH Championship', 'standings', 'results', 'fixtures', 'match centre', 'tickets', 'membership', 'news', 'Airtel Top 8'],
  appleWebApp: {
    capable: true,
    title: 'Ekhaya FC',
    statusBarStyle: 'default',
  },
  formatDetection: { telephone: false },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ),
  openGraph: {
    title: 'EKHAYA FC DIGITAL APP',
    description:
      'The digital home of Ekhaya FC — live match centre, fixtures, results, standings, performance, news, highlights, tickets and fan membership. Airtel Top 8 champions.',
    type: 'website',
    locale: 'en_ZA',
  },
};

export const viewport: Viewport = {
  themeColor: '#C9A227',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${oswald.variable} ${inter.variable} bg-[#F7F5F0] font-sans text-[#3d3d3d] antialiased`}
      >
        <StoreCartProvider>
          <NotificationsProvider>
            {children}
            <CartDrawer />
          </NotificationsProvider>
        </StoreCartProvider>
        <PwaRegister />
        <PageViewTracker />
      </body>
    </html>
  );
}