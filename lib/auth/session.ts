import { createClient as createServerClient } from '@/lib/supabase/server';

export interface SessionUser {
  id: string;
  email: string | null;
  role?: string | null;
  fullName?: string | null;
  user_metadata: Record<string, unknown>;
}

/** Current session user with their profile role (server-side only). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  let role: string | null = null;
  let fullName: string | null = null;
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .maybeSingle();
  if (profile) {
    role = (profile.role as string) ?? null;
    fullName = (profile.full_name as string) ?? null;
  }

  return {
    id: user.id,
    email: user.email,
    role,
    fullName,
    user_metadata: (user.user_metadata ?? {}) as Record<string, unknown>,
  };
}