import type { Metadata } from 'next';
import { FanNav } from '@/components/fan-nav';
import { Footer } from '@/components/brand/footer';
import { PageHero } from '@/components/brand/hero';
import { CheckoutForm } from '@/components/store/checkout-form';

export const metadata: Metadata = { title: 'Store Checkout' };

export default function StoreCheckoutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <FanNav />
      <PageHero
        eyebrow="Ekhaya FC"
        title="Store Checkout"
        subtitle="Review your order, tell us where to hold your collection and pay securely."
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <CheckoutForm />
      </main>

      <Footer />
    </div>
  );
}