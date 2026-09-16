'use client';

import { useActionState } from 'react';
import {
  createWeeklyBudget,
  createBudgetItem,
  type ActionResult,
} from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';
import type { WeeklyBudget } from '@/types';

export function BudgetForm({ budgets }: { budgets: WeeklyBudget[] }) {
  const [budgetState, budgetAction, budgetPending] = useActionState<
    ActionResult | null,
    FormData
  >(createWeeklyBudget, null);
  const [itemState, itemAction, itemPending] = useActionState<ActionResult | null, FormData>(
    createBudgetItem,
    null,
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={budgetAction} className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-base font-bold text-slate-900">New weekly budget</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Week starting *">
            <TextInput name="week_start" type="date" required />
          </Field>
          <Field label="Week ending *">
            <TextInput name="week_end" type="date" required />
          </Field>
          <Field label="Notes" className="sm:col-span-2">
            <TextArea name="notes" placeholder="Budget notes" />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <SubmitButton pending={budgetPending} label="Create budget" />
          {budgetState && (
            <p className={`text-sm ${budgetState.success ? 'text-green-600' : 'text-red-600'}`}>
              {budgetState.message}
            </p>
          )}
        </div>
      </form>

      <form action={itemAction} className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-4 text-base font-bold text-slate-900">Add budget line item</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Budget *">
            <SelectInput name="budget_id" required defaultValue="">
              <option value="" disabled>
                Select budget
              </option>
              {budgets.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.week_start} → {b.week_end}
                </option>
              ))}
            </SelectInput>
          </Field>
          <Field label="Category *">
            <SelectInput name="category" defaultValue="Training">
              <option>Training</option>
              <option>Transport</option>
              <option>Allowances</option>
              <option>Medical</option>
              <option>Equipment</option>
              <option>Match day</option>
              <option>Refreshments</option>
              <option>Other</option>
            </SelectInput>
          </Field>
          <Field label="Description">
            <TextInput name="description" placeholder="What is the item for?" />
          </Field>
          <Field label="Planned amount (MK)">
            <TextInput name="planned_amount" type="number" min="0" step="0.01" defaultValue="0" />
          </Field>
          <Field label="Actual amount (MK)">
            <TextInput name="actual_amount" type="number" min="0" step="0.01" placeholder="0.00" />
          </Field>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <SubmitButton pending={itemPending} label="Add line item" />
          {itemState && (
            <p className={`text-sm ${itemState.success ? 'text-green-600' : 'text-red-600'}`}>
              {itemState.message}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}