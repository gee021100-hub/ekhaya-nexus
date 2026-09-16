'use client';

import { useActionState } from 'react';
import { createTransfer, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';
import type { Team } from '@/types';

export function TransferForm({ teams }: { teams: Team[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createTransfer,
    null,
  );

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">Record a transfer</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Player name *">
          <TextInput name="player_name" required placeholder="Full name" />
        </Field>
        <Field label="Team *">
          <SelectInput name="team_id" required defaultValue="">
            <option value="" disabled>
              Select team
            </option>
            {teams.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Type *">
          <SelectInput name="transfer_type" defaultValue="in">
            <option value="in">Transfer in</option>
            <option value="out">Transfer out</option>
          </SelectInput>
        </Field>
        <Field label="Other club *">
          <TextInput name="other_club" required placeholder="Club name" />
        </Field>
        <Field label="Transfer date *">
          <TextInput name="transfer_date" type="date" required />
        </Field>
        <Field label="Fee amount (MK)">
          <TextInput name="fee_amount" type="number" min="0" step="0.01" placeholder="0.00" />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <TextArea name="notes" placeholder="Additional notes" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Record transfer" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}