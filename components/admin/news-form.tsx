'use client';

import { useActionState } from 'react';
import { createNewsArticle, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, TextArea, SubmitButton } from '@/components/admin/form';

export function NewsForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createNewsArticle,
    null,
  );

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">Publish news article</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *" className="sm:col-span-2">
          <TextInput name="title" placeholder="Headline" required />
        </Field>
        <Field label="Summary" className="sm:col-span-2">
          <TextArea name="summary" placeholder="Short summary shown on the news list" />
        </Field>
        <Field label="Content *" className="sm:col-span-2">
          <TextArea name="content" placeholder="Full article text" className="min-h-28" required />
        </Field>
        <Field label="Category">
          <SelectInput name="category" defaultValue="News">
            <option>News</option>
            <option>Club</option>
            <option>Match</option>
            <option>Transfer</option>
            <option>Community</option>
          </SelectInput>
        </Field>
        <Field label="Published at">
          <TextInput name="published_at" type="datetime-local" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Publish article" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}