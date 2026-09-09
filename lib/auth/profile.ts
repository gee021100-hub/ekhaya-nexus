import type { SupabaseClient } from '@supabase/supabase-js';
import type { AppRole } from '@/lib/auth/permissions';

export interface ProfileUpsert {
  full_name: string;
  phone?: string | null;
  whatsapp?: string | null;
  date_of_birth?: string | null;
  id_number?: string | null;
}

/**
 * Ensures a profiles row exists for a newly signed-up auth user and bootstraps
 * name/phone/DOB from auth metadata if present. The on_auth_user_created
 * trigger already guarantees the row exists - this heals any gaps.
 */
export async function ensureProfile(
  supabase: SupabaseClient,
  userId: string,
  email: string,
  input: Partial<ProfileUpsert> = {},
) {
  const { data: existing } = await supabase
    .from('profiles')
    .select('id, role, full_name, email, phone, whatsapp, date_of_birth')
    .eq('id', userId)
    .maybeSingle();

  if (existing) {
    const blank = (v: unknown) => v == null || v === '';
    const patch: Record<string, unknown> = {};
    if (blank(existing.full_name) && input.full_name) patch.full_name = input.full_name;
    if (blank(existing.phone) && input.phone) patch.phone = input.phone;
    if (blank(existing.whatsapp) && input.whatsapp) patch.whatsapp = input.whatsapp;
    if (blank(existing.date_of_birth) && input.date_of_birth) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(input.date_of_birth)) {
        patch.date_of_birth = input.date_of_birth;
      }
    }
    if (Object.keys(patch).length > 0) {
      await supabase.from('profiles').update(patch).eq('id', userId);
    }
    return existing as { id: string; role?: AppRole; full_name?: string };
  }

  const { data, error } = await supabase
    .from('profiles')
    .upsert(
      {
        id: userId,
        email,
        full_name: input.full_name ?? '',
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.whatsapp ? { whatsapp: input.whatsapp } : {}),
        ...(input.date_of_birth ? { date_of_birth: input.date_of_birth } : {}),
        ...(input.id_number ? { id_number: input.id_number } : {}),
      },
      { onConflict: 'id' },
    )
    .select('id, role')
    .maybeSingle();

  if (error) throw error;
  return data as { id: string; role?: AppRole };
}