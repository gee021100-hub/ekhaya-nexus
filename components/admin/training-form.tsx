'use client';

import { useActionState } from 'react';
import { createTrainingAllocation, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';
import type { Team } from '@/types';

export function TrainingForm({ teams }: { teams: Team[] }) {
  const [state, formAction, pending] = useActionState<ActionResult | null, FormData>(
    createTrainingAllocation,
    null,
  );

  return (
    <form action={formAction} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">New training allocation</h3>
      <div className="grid gap-4 sm:grid-cols-2">
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
        <Field label="Training date *">
          <TextInput name="training_date" type="date" required />
        </Field>
        <Field label="Session type">
          <SelectInput name="session_type" defaultValue="">
            <option value="">— Select session —</option>
            <option>Technical</option>
            <option>Tactical</option>
            <option>Physical</option>
            <option>Gym</option>
            <option>Recovery</option>
            <option>Match preparation</option>
          </SelectInput>
        </Field>
        <Field label="Location">
          <TextInput name="location" placeholder="Training ground" />
        </Field>
        <Field label="Players invited">
          <TextInput name="players_invited" type="number" min="0" placeholder="e.g. 25" />
        </Field>
        <Field label="Budget amount (MK)">
          <TextInput name="budget_amount" type="number" min="0" step="0.01" placeholder="0.00" />
        </Field>
        <Field label="Description" className="sm:col-span-2">
          <TextArea name="description" placeholder="Session description / focus" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Add allocation" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}