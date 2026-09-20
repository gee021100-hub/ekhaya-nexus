'use client';

import { useActionState } from 'react';
import { submitContact, type FanActionResult } from '@/app/actions';
import { Field, TextInput, TextArea, SubmitButton } from '@/components/admin/form';

export function ContactForm() {
  const [state, action, pending] = useActionState<FanActionResult | null, FormData>(
    submitContact,
    null,
  );

  return (
    <form
      action={action}
      className="ekhaya-card p-5"
    >
      <h3 className="font-display mb-4 text-xl font-semibold uppercase tracking-wide text-club-ink">Send the club a message</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name *" className="sm:col-span-2">
          <TextInput name="name" required placeholder="Full name" />
        </Field>
        <Field label="Email *">
          <TextInput name="email" type="email" required placeholder="you@example.com" />
        </Field>
        <Field label="Subject">
          <TextInput name="subject" placeholder="e.g. Boarding schools, tickets, sponsorship" />
        </Field>
        <Field label="Message *" className="sm:col-span-2">
          <TextArea name="message" required placeholder="How can the club help?" className="min-h-32" />
        </Field>
        <div className="sr-only" aria-hidden="true">
          <label>
            Leave this field empty
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Send message" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}