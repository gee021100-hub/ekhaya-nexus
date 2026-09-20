'use client';

import { useActionState } from 'react';
import { createAnnouncement, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';

export function AnnouncementForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createAnnouncement,
    null,
  );

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">Publish announcement</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *" className="sm:col-span-2">
          <TextInput name="title" placeholder="Headline" required />
        </Field>
        <Field label="Body" className="sm:col-span-2">
          <TextArea name="body" placeholder="Short message shown on the home page" className="min-h-24" />
        </Field>
        <Field label="Type">
          <SelectInput name="type" defaultValue="Announcement">
            <option>Announcement</option>
            <option>Club</option>
            <option>Match</option>
            <option>Tickets</option>
            <option>Community</option>
          </SelectInput>
        </Field>
        <Field label="Publish at">
          <TextInput name="published_at" type="datetime-local" />
        </Field>
      </div>
      <label className="mt-4 flex items-center gap-2 text-sm text-slate-600">
        <input
          type="checkbox"
          name="is_pinned"
          className="h-4 w-4 rounded border-slate-300 text-club-gold-600 focus:ring-club-gold-500"
        />
        Pin to the top of the announcements strip
      </label>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Publish announcement" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}