'use client';

import { useActionState } from 'react';
import { createFanPoll, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';
import { POLL_CATEGORIES } from '@/types';

export function PollForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createFanPoll,
    null,
  );

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">New fan poll</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Question *">
          <TextInput name="question" required placeholder="Who will be Player of the Week?" />
        </Field>
        <Field label="Category">
          <SelectInput name="category" defaultValue="Match Prediction">
            {POLL_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Featured match (optional)">
          <TextInput name="featured_match" placeholder="e.g. vs Big Bullets" />
        </Field>
        <Field label="Closes on (optional)">
          <TextInput name="ends_at" type="datetime-local" />
        </Field>
        <Field label="Answer options * (one per line)" className="sm:col-span-2">
          <TextArea
            name="options"
            required
            placeholder={'Big Bullets\nMighty Wanderers\nDraw'}
            rows={5}
          />
        </Field>
        <Field label="Description (optional)" className="sm:col-span-2">
          <TextInput name="description" placeholder="Extra context shown on the poll card" />
        </Field>
        <label className="flex items-center gap-2 pt-6 text-sm text-slate-700">
          <input type="checkbox" name="active" defaultChecked className="accent-club-gold" />
          Open for votes immediately
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Publish poll" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}