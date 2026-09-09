import { STAFF_ROLES, type AppRole } from '@/lib/auth/permissions';
import { getSessionUser, type SessionUser } from '@/lib/auth/session';
import { requireRole, requireUser } from '@/lib/auth/route-guard';

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect('/sign-in');
  return user;
}

export async function requireRole(...roles: AppRole[]): Promise<SessionUser> {
  const user = await requireUser();
  const allowed = roles.includes('super_admin') ? roles : ['super_admin', ...roles];
  if (!user.role || !(allowed as string[]).includes(user.role)) {
    redirect(isStaff(user.role) ? '/staff/forbidden' : '/member/dashboard');
  }
  return user;
}

export async function isStaffSession(): Promise<boolean> {
  const user = await getSessionUser();
  return Boolean(user?.role && (STAFF_ROLES as string[]).includes(user.role));
}