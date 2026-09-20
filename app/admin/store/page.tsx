import type { Metadata } from 'next';
import { getStoreProducts, getStoreOrders } from '@/lib/data';
import { StoreProductForm } from '@/components/admin/store-product-form';
import { StoreManager } from '@/components/admin/store-manager';

export const metadata: Metadata = { title: 'Official Store' };

export default async function AdminStorePage() {
  const [products, orders] = await Promise.all([getStoreProducts(), getStoreOrders()]);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Official Store</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage the merchandise catalogue shown on /store and follow up fan orders.
        </p>
      </section>

      <StoreProductForm />
      <StoreManager products={products} orders={orders} />
    </div>
  );
}