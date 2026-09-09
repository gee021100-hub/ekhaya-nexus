'use function';

import { redirect } from 'next/navigation';
import { createClient as createServerClient, supabaseConfigured } from '@/lib/supabase/server';
import { ensureProfile } from '@/lib/auth/profile';
import { TEMPLATE_CODES } from '@/lib/notifications';
import type { RegisterInput, SignInInput } from '@/lib/schemas';

export type AuthActionResult =
  | { ok: true; needsEmailConfirmation?: boolean }
  | { ok: false; error: string };

function configError(): AuthActionResult {
  return {
    ok: false,
    error:
      'Supabase auth is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local.',
  };
}

export async function signUpAction(input: RegisterInput): Promise<AuthActionResult> {
  if (!supabaseConfigured()) return configError();

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: {
        full_name: input.fullName,
        phone: input.mobile,
        date_of_birth: input.dateOfBirth,
        location: input.location,
        preferred_channel: input.preferredChannel,
        campaign_source: input.campaignSource,
      },
    },
  });

  if (error) return { ok: false, error: error.message };
  if (!data.user) return { ok: false, error: 'Sign-up failed. Please try again.' };

  // Bootstrap the profiles row. Persistence is guaranteed by the trigger, so
  // a profile hiccup must never fail registration.
  const profile = await ensureProfile(supabase, data.user.id, input.email, {
    full_name: input.fullName,
    phone: input.mobile,
    whatsapp: input.whatsapp || input.mobile,
    date_of_birth: input.dateOfBirth,
  }).catch(() => undefined);
  void profile;

  try {
    const { notifyEssential } = await import('@/lib/notifications/deliver');
    await notifyEssential(supabase, {
      profileId: data.user.id,
      channel: 'email',
      type: TEMPLATE_CODES.welcome,
      templateCode: TEMPLATE_CODES.welcome,
      subject: 'Welcome to Ekhaya FC!',
      body: `Hi ${input.fullName}, welcome to Ekhaya FC. Complete your membership on the join page to start enjoying club benefits.`,
    });
  } catch {
    /* best effort - never blocks sign-up */
  }

  return { ok: true, needsEmailConfirmation: !data.session };
}

export async function signInAction(input: SignInInput): Promise<AuthActionResult> {
  if (!supabaseConfigured()) return configError();

  const supabase = await createServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(input);
  if (error) return { ok: false, error: 'Invalid email or password.' };

  if (data.user) {
    const meta = data.user.user_metadata as Record<string, unknown> | undefined;
    await ensureProfile(supabase, data.user.id, data.user.email ?? input.email, {
      full_name: String(meta?.full_name ?? ''),
      phone: meta?.phone ? String(meta.phone) : undefined,
      whatsapp: meta?.whatsapp ? String(meta.whatsapp) : undefined,
      date_of_birth: meta?.date_of_birth ? String(meta.date_of_birth) : undefined,
    }).catch(() => undefined);
  }

  return { ok: true };
}

export async function signOutAction(): Promise<void> {
  if (!supabaseConfigured()) return;
  const supabase = await createServerClient();
  await supabase.auth.signOut();
  redirect('/sign-in');
}