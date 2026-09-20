'use client';

import Link from 'next/link';
import { useStoreCart } from '@/components/store/cart-context';
import { formatMoney } from '@/lib/utils';

export function CartDrawer() {
  const { items, total, count, isOpen, closeDrawer, updateQuantity, removeItem } = useStoreCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50" aria-hidden="false" role="dialog" aria-modal="true">
      <button
        type="button"
        onClick={closeDrawer}
        className="absolute inset-0 bg-black/40"
        aria-label="Close cart"
      />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-club-border px-5 py-4">
          <h2 className="font-display text-xl font-semibold uppercase tracking-wide text-club-ink">
            Your cart {count > 0 && <span className="text-club-gold-600">({count})</span>}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-lg border border-club-border px-2.5 py-1 text-sm text-[#3d3d3d] hover:bg-club-gold-100"
          >
            Close
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-sm text-slate-500">Your cart is empty.</p>
            <button
              type="button"
              onClick={closeDrawer}
              className="btn-gold px-5 py-2 text-sm"
            >
              Browse the store
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-club-border overflow-y-auto px-5">
              {items.map((item, idx) => {
                const key = `${item.productId}-${idx}`;
                return (
                  <li key={key} className="py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="font-semibold text-club-ink">{item.name}</p>
                        {item.size && <p className="text-xs text-slate-500">Size: {item.size}</p>}
                        {item.customText && (
                          <p className="text-xs text-slate-500">Text: {item.customText}</p>
                        )}
                        <p className="mt-1 text-sm font-semibold text-club-gold-700">
                          {formatMoney(item.unitPrice)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.customText, -1)}
                          className="h-8 w-8 rounded-lg border border-club-border text-sm hover:bg-club-gold-100"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.size, item.customText, 1)}
                          className="h-8 w-8 rounded-lg border border-club-border text-sm hover:bg-club-gold-100"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(item.productId, item.size, item.customText)}
                          className="ml-1 text-sm text-[#8a8a8a] hover:text-red-600"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <footer className="border-t border-club-border px-5 py-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-500">Total</span>
                <span className="font-display text-2xl font-semibold text-club-ink">{formatMoney(total)}</span>
              </div>
              <div className="mt-3 grid gap-2">
                <Link
                  href="/store/checkout"
                  onClick={closeDrawer}
                  className="btn-gold w-full text-center"
                >
                  Checkout
                </Link>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="w-full rounded-lg border border-club-border px-4 py-2 text-sm font-semibold text-[#3d3d3d] hover:bg-club-gold-100"
                >
                  Continue shopping
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}