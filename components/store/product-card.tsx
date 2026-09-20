'use client';

import { useState } from 'react';
import { useStoreCart } from '@/components/store/cart-context';
import { formatMoney } from '@/lib/utils';
import type { StoreProduct } from '@/types';

export function ProductCard({ product }: { product: StoreProduct }) {
  const { addItem } = useStoreCart();
  const [size, setSize] = useState<string>(product.sizes[0] ?? '');
  const [customText, setCustomText] = useState('');
  const [customizing, setCustomizing] = useState(false);
  const [added, setAdded] = useState(false);

  const canCustomize = product.customizable;
  const image = product.image_url;

  function handleAdd() {
    addItem({
      productId: product.id,
      name: product.name,
      category: product.category,
      unitPrice: Number(product.price ?? 0),
      imageUrl: image,
      sizes: product.sizes,
      customizable: canCustomize,
      size: product.sizes.length > 0 ? size || null : null,
      customText: canCustomize && customizing ? customText.trim().slice(0, 60) || null : null,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1500);
  }

  return (
    <article className="ekhaya-card flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] bg-[#efe9dc]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-sm uppercase tracking-wide text-[#c3b98f]">
              Ekhaya FC
            </span>
          </div>
        )}
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-club-ink px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
            {product.badge}
          </span>
        )}
        {product.original_price && Number(product.original_price) > Number(product.price) && (
          <span className="absolute right-3 top-3 rounded-full bg-club-gold px-2 py-0.5 text-[11px] font-bold uppercase text-club-ink">
            Sale
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8a8a8a]">
              {product.category}
            </p>
            <h3 className="font-display text-lg font-semibold uppercase tracking-wide text-club-ink">
              {product.name}
            </h3>
          </div>
          <div className="text-right">
            <p className="font-display text-lg font-semibold text-club-gold-700">
              {formatMoney(Number(product.price ?? 0))}
            </p>
            {product.original_price && Number(product.original_price) > Number(product.price) && (
              <p className="text-xs text-[#8a8a8a] line-through">
                {formatMoney(Number(product.original_price))}
              </p>
            )}
          </div>
        </div>

        {product.description && <p className="text-sm text-slate-600">{product.description}</p>}

        {product.sizes.length > 0 && (
          <label className="text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-[#8a8a8a]">Size</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 w-full rounded-lg border border-club-border bg-white px-3 py-1.5 text-sm"
            >
              {product.sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}

        {canCustomize && (
          <label className="flex items-start gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={customizing}
              onChange={(e) => setCustomizing(e.target.checked)}
              className="mt-1 accent-club-gold"
            />
            <span>
              Personalise with a player name & number
              {customizing && (
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="e.g. NYIRENDA · 7"
                  maxLength={60}
                  className="mt-1 w-full rounded-lg border border-club-border bg-white px-3 py-1.5 text-sm"
                />
              )}
            </span>
          </label>
        )}

        <button
          type="button"
          onClick={handleAdd}
          disabled={!product.in_stock}
          className={`${added ? 'bg-green-600' : 'btn-gold'} mt-auto disabled:cursor-not-allowed disabled:opacity-50`}
        >
          {!product.in_stock
            ? 'Out of stock'
            : added
              ? 'Added to cart'
              : 'Add to cart'}
        </button>
      </div>
    </article>
  );
}