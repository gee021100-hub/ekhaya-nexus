'use client';

import { useActionState } from 'react';
import { createStoreProduct, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, SubmitButton } from '@/components/admin/form';
import { STORE_CATEGORIES } from '@/types';

export function StoreProductForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createStoreProduct,
    null,
  );

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">New store product</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product name *">
          <TextInput name="name" required placeholder="e.g. Home kit 2026" />
        </Field>
        <Field label="Category *">
          <SelectInput name="category" required defaultValue="Kits">
            {STORE_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Price (MK) *">
          <TextInput name="price" type="number" min="0" step="0.01" defaultValue="0" />
        </Field>
        <Field label="Original price (MK) — optional sale price">
          <TextInput name="original_price" type="number" min="0" step="0.01" placeholder="Higher than price" />
        </Field>
        <Field label="Description">
          <TextInput name="description" placeholder="Short product description" />
        </Field>
        <Field label="Badge (optional)">
          <TextInput name="badge" placeholder="e.g. Bestseller, New" />
        </Field>
        <Field label="Image URL (optional)">
          <TextInput name="image_url" placeholder="https://…" />
        </Field>
        <Field label="Sizes (comma separated)">
          <TextInput name="sizes" placeholder="S, M, L, XL, 2XL" />
        </Field>
        <Field label="Sort order">
          <TextInput name="sort_order" type="number" min="0" step="1" defaultValue="0" />
        </Field>
        <div className="grid content-start gap-3 pt-6 text-sm text-slate-700">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="customizable" className="accent-club-gold" />
            Personalisable (name &amp; number)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="in_stock" defaultChecked className="accent-club-gold" />
            In stock
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="enabled" defaultChecked className="accent-club-gold" />
            Visible in the store
          </label>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Add product" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}