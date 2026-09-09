export const MEMBERSHIP_STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Awaiting payment',
  pending: 'Pending',
  active: 'Active',
  upgrading: 'Upgrading',
  cancelled: 'Cancelled',
  expired: 'Expired',
};

export function membershipStatusLabel(status: string): string {
  return MEMBERSHIP_STATUS_LABELS[status] ?? status;
}