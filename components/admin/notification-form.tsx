'use client';

import { useActionState } from 'react';
import { createFanNotification, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';
import { NOTIFICATION_CATEGORIES, NOTIFICATION_CATEGORY_LABELS } from '@/types';

export function NotificationForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createFanNotification,
    null,
  );

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">Broadcast a notification</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *">
          <TextInput name="title" required placeholder="e.g. Match-day reminder" />
        </Field>
        <Field label="Category">
          <SelectInput name="category" defaultValue="news">
            {NOTIFICATION_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {NOTIFICATION_CATEGORY_LABELS[c]}
              </option>
            ))}
          </SelectInput>
        </Field>
        <Field label="Message *" className="sm:col-span-2">
          <TextArea name="message" required rows={3} placeholder="What fans should know…" />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" name="enabled" defaultChecked className="accent-club-gold" />
          Visible in the fan notification tray
        </label>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Send notification" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>{state.message}</p>
        )}
      </div>
    </form>
  );
}