'use client';

import { useActionState } from 'react';
import { saveSiteSettings, type ActionResult } from '@/app/admin/actions';
import { SITE_SETTING_FIELDS, type SiteSettings } from '@/types';
import { Field, TextInput, TextArea, SubmitButton } from '@/components/admin/form';

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    saveSiteSettings,
    null,
  );

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">Club &amp; contact details</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        {SITE_SETTING_FIELDS.map((field) => {
          const value = settings[field.key] ?? '';
          const long = field.key === 'about_blurb';
          const input = long ? (
            <TextArea key={field.key} name={field.key} defaultValue={value} placeholder={field.placeholder} className="min-h-28" />
          ) : (
            <TextInput key={field.key} name={field.key} defaultValue={value} placeholder={field.placeholder} />
          );
          return (
            <Field key={field.key} label={field.label} className={long ? 'sm:col-span-2' : undefined}>
              {input}
            </Field>
          );
        })}
      </div>
      <p className="mt-4 text-xs text-slate-500">
        Leave a field blank to remove it. Values appear on the Contact, About and home pages and in the footer.
      </p>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Save settings" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}