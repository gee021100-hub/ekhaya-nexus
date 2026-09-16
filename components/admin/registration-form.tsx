'use client';

import { useActionState } from 'react';
import { createRegistration, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';
import type { Team } from '@/types';

export function RegistrationForm({ teams }: { teams: Team[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createRegistration,
    null,
  );

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">Register a player</h3>
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
        <Field label="Position">
          <TextInput name="position" placeholder="e.g. Striker" />
        </Field>
        <Field label="Date of birth">
          <TextInput name="date_of_birth" type="date" />
        </Field>
        <Field label="Registration date">
          <TextInput name="registration_date" type="date" />
        </Field>
        <Field label="Registration fee (MK)">
          <TextInput name="fee_amount" type="number" min="0" step="0.01" placeholder="0.00" />
        </Field>
        <Field label="Notes" className="sm:col-span-2">
          <TextArea name="notes" placeholder="Additional notes" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Register player" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}