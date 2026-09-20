'use client';

import { useTransition } from 'react';
import {
  cancelStoreOrder,
  deleteStoreProduct,
  toggleStoreProduct,
} from '@/app/admin/actions';
import { formatMoney } from '@/lib/utils';
import type { StoreProduct, StoreOrder } from '@/types';

const CATEGORY_STYLES: Record<string, string> = {
  Kits: 'bg-club-gold-100 text-club-gold-800',
  Training: 'bg-blue-100 text-blue-800',
  Fashion: 'bg-purple-100 text-purple-800',
  Accessories: 'bg-teal-100 text-teal-800',
  Collectibles: 'bg-rose-100 text-rose-800',
};

type ManagerProps = {
  products: StoreProduct[];
  orders: StoreOrder[];
};

export function StoreManager({ products, orders }: ManagerProps) {
  const [isPending, startTransition] = useTransition();

  const pendingOrders = orders.filter((o) => o.payment_status === 'pending');
  const paidOrders = orders.filter((o) => o.payment_status === 'paid');

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">Products ({products.length})</h3>
        {products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No products yet. Add your first item to open the store.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${CATEGORY_STYLES[product.category] ?? 'bg-slate-100 text-slate-700'}`}
                    >
                      {product.category}
                    </span>
                    <p className="mt-1.5 font-bold text-slate-900">{product.name}</p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-semibold text-club-gold-700">
                    {formatMoney(product.price)}
                  </p>
                </div>
                {product.badge && (
                  <p className="mt-0.5 text-xs font-semibold uppercase text-[#8a8a8a]">{product.badge}</p>
                )}
                {product.sizes.length > 0 && (
                  <p className="mt-1 text-xs text-slate-500">Sizes: {product.sizes.join(', ')}</p>
                )}
                {product.customizable && (
                  <p className="mt-0.5 text-xs text-slate-500">Personalisable·</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={`rounded-full px-2 py-0.5 font-semibold ${
                      product.enabled ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {product.enabled ? 'Live' : 'Hidden'}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 font-semibold ${
                      product.in_stock ? 'bg-teal-100 text-teal-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.in_stock ? 'In stock' : 'Out of stock'}
                  </span>
                  <span className="flex-1" />
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => startTransition(() => void toggleStoreProduct(product.id, !product.enabled))}
                    className="rounded-md border border-slate-300 px-2 py-1 font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    {product.enabled ? 'Hide' : 'Show'}
                  </button>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      if (window.confirm(`Delete ${product.name}?`)) {
                        startTransition(() => void deleteStoreProduct(product.id));
                      }
                    }}
                    className="rounded-md border border-red-200 px-2 py-1 font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3 className="mb-4 text-lg font-bold text-slate-900">
          Orders — awaiting payment ({pendingOrders.length})
        </h3>
        {pendingOrders.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No pending store orders. Paid orders confirm automatically through the payment flow.
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900">
                      {order.reference} · {order.customer_name}
                    </p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {order.customer_email}
                      {order.customer_phone ? ` · ${order.customer_phone}` : ''}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {order.items.length} item{order.items.length === 1 ? '' : 's'} ·{' '}
                      {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-club-gold-700">{formatMoney(order.total)}</span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => startTransition(() => void cancelStoreOrder(order.id))}
                      className="rounded-md border border-red-200 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Mark order as cancelled
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {paidOrders.length > 0 && (
        <section>
          <h3 className="mb-4 text-lg font-bold text-slate-900">Paid orders ({paidOrders.length})</h3>
          <div className="grid gap-4">
            {paidOrders.map((order) => (
              <div key={order.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900">{order.reference} · {order.customer_name}</p>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {order.items.length} item{order.items.length === 1 ? '' : 's'} · {' '}
                      {order.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-green-700">{formatMoney(order.total)}</span>
                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                      Paid
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}