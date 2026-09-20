'use client';

import { useActionState } from 'react';
import { createTicketAllocation, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, SubmitButton } from '@/components/admin/form';
import { TICKET_CATEGORIES } from '@/types';
import type { Fixture } from '@/types';

export function TicketForm({ fixtures }: { fixtures: Fixture[] }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createTicketAllocation,
    null,
  );

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">New ticket allocation</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fixture *">
          <SelectInput name="fixture_id" required defaultValue="">
            <option value="" disabled>
              Select fixture
            </option>
            {fixtures.map((f) => (
              <option key={f.id} value={f.id}>
                {f.home_team} vs {f.away_team} — {f.match_date}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Category *">
          <SelectInput name="category" required defaultValue="Open Stand">
            {TICKET_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Price per ticket (MK)">
          <TextInput name="price" type="number" min="0" step="0.01" defaultValue="0" />
        </Field>
        <Field label="Capacity">
          <TextInput name="capacity" type="number" min="0" step="1" defaultValue="0" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Create allocation" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}