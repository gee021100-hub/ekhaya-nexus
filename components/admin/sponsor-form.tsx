'use client';

import { useActionState } from 'react';
import { createSponsor, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';

export function SponsorForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createSponsor,
    null,
  );

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">Add sponsor or partner</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name *" className="sm:col-span-2">
          <TextInput name="name" placeholder="Company name" required />
        </Field>
        <Field label="Partnership level">
          <SelectInput name="level" defaultValue="Official Partner">
            <option>Official Partner</option>
            <option>Gold</option>
            <option>Silver</option>
            <option>Community</option>
          </SelectInput>
        </Field>
        <Field label="Sort order">
          <TextInput name="sort_order" type="number" placeholder="0" />
        </Field>
        <Field label="Website">
          <TextInput name="website" type="url" placeholder="https://…" />
        </Field>
        <Field label="Logo URL">
          <TextInput name="logo_url" type="url" placeholder="https://…/logo.png" />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <TextArea name="description" placeholder="One line about the partnership" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Add sponsor" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}