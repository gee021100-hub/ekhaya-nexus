'use client';

import { useEffect } from 'react';
import { useActionState } from 'react';
import { signInAdmin, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SubmitButton } from '@/components/admin/form';

export function LoginForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    signInAdmin,
    null,
  );

  // Session cookie is set by the action; a hard navigation guarantees the
  // auth middleware receives the full request (Next's action redirect can be
  // dropped while the admin layout prefetches routes).
  useEffect(() => {
    if (state?.success) {
      window.location.href = '/admin';
    }
  }, [state]);

  return (
    <form
      action={action}
      className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <Field label="Email">
        <TextInput
          name="email"
          type="email"
          autoComplete="email"
          placeholder="admin@ekhaya.fc"
          required
        />
      </Field>
      <Field label="Password">
        <TextInput
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </Field>
      <div className="flex items-center gap-3">
        <SubmitButton pending={pending} label="Sign in" pendingLabel="Signing in…" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
      <p className="text-xs text-slate-400">
        Staff accounts are managed through Supabase Auth. Invite a user in the
        Supabase dashboard, then sign in here.
      </p>
    </form>
  );
}