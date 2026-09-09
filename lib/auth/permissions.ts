export type AppRole =
  | 'super_admin'
  | 'membership_officer'
  | 'finance_officer'
  | 'marketing_officer'
  | 'merchandise_officer'
  | 'event_gate_officer'
  | 'management_auditor'
  | 'member';

export const STAFF_ROLES: AppRole[] = [
  'super_admin',
  'membership_officer',
  'finance_officer',
  'marketing_officer',
  'merchandise_officer',
  'event_gate_officer',
  'management_auditor',
];

export function isStaff(role?: string | null): boolean {
  return role != null && (STAFF_ROLES as string[]).includes(role);
}

export function isAdmin(role?: string | null): boolean {
  return role === 'super_admin';
}

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Administrator',
  membership_officer: 'Membership Officer',
  finance_officer: 'Finance Officer',
  marketing_officer: 'Marketing Officer',
  merchandise_officer: 'Merchandise Officer',
  event_gate_officer: 'Event Gate Officer',
  management_auditor: 'Management Auditor',
  member: 'Member',
};

export function roleLabel(role?: string | null): string {
  if (!role) return '—';
  return ROLE_LABELS[role] ?? role;
}