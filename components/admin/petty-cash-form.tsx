'use client';

import { useActionState } from 'react';
import { createPettyCashTransaction, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';

export function PettyCashForm() {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createPettyCashTransaction,
    null,
  );

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">New petty cash entry</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Type *">
          <SelectInput name="transaction_type" defaultValue="out">
            <option value="out">Cash out</option>
            <option value="in">Cash in</option>
          </SelectInput>
        </Field>
        <Field label="Date">
          <TextInput name="transaction_date" type="date" />
        </Field>
        <Field label="Description *">
          <TextInput name="description" required placeholder="What was this for?" />
        </Field>
        <Field label="Amount (MK) *">
          <TextInput name="amount" type="number" min="0" step="0.01" required placeholder="0.00" />
        </Field>
        <Field label="Category">
          <SelectInput name="category" defaultValue="">
            <option value="">— Select category —</option>
            <option>Transport</option>
            <option>Refreshments</option>
            <option>Medical</option>
            <option>Equipment</option>
            <option>Cleaning</option>
            <option>Utilities</option>
            <option>Other</option>
          </SelectInput>
        </Field>
        <Field label="Requestor">
          <TextInput name="requestor" placeholder="Who requested?" />
        </Field>
        <Field label="Approved by">
          <TextInput name="approved_by" placeholder="Who approved?" />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <TextArea name="notes" placeholder="Additional notes" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Add entry" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}