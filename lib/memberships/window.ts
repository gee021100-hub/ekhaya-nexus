import { addMonths, addYears } from 'date-fns';

export type BillingPeriod = 'monthly' | 'annual';

export interface MembershipWindow {
  startsAt: string;
  endsAt: string;
}

/** Membership validity windows: annual = +1 year, monthly = +1 month. */
export function computeMembershipWindow(
  billingPeriod: BillingPeriod = 'annual',
  from = new Date(),
): MembershipWindow {
  const startsAt = from;
  const endsAt = billingPeriod === 'monthly' ? addMonths(from, 1) : addYears(from, 1);
  return {
    startsAt: startsAt.toISOString(),
    endsAt: endsAt.toISOString(),
  };
}