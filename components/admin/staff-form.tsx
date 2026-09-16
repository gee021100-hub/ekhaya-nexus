'use client';

import { useActionState } from 'react';
import { createStaffAllowance, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';
import type { Team } from '@/types';

export function StaffAllowanceForm({ teams }: { teams: Team[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createStaffAllowance,
    null,
  );

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">New staff allowance</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Staff name *">
          <TextInput name="staff_name" required placeholder="Full name" />
        </Field>
        <Field label="Role">
          <SelectInput name="role" defaultValue="">
            <option value="">— Select role —</option>
            <option>Head Coach</option>
            <option>Assistant Coach</option>
            <option>Goalkeeper Coach</option>
            <option>Team Manager</option>
            <option>Physiotherapist</option>
            <option>Kit Manager</option>
            <option>Team Doctor</option>
            <option>Security</option>
            <option>Other</option>
          </SelectInput>
        </Field>
        <Field label="Team">
          <SelectInput name="team_id" defaultValue="">
            <option value="">All teams</option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Amount (MK)">
          <TextInput name="amount" type="number" min="0" step="0.01" placeholder="0.00" />
        </Field>
        <Field label="Period start *">
          <TextInput name="period_start" type="date" required />
        </Field>
        <Field label="Period end *">
          <TextInput name="period_end" type="date" required />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <TextArea name="notes" placeholder="Additional notes" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Add allowance" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}