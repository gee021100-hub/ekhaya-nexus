import { createAdminClient, adminConfigured } from '@/lib/supabase/admin';
import { generateCardNumber } from '@/lib/memberships/number';

/**
 * System-level membership orchestration. These functions use the service-role
 * client (bypasses RLS) on purpose: memberships/payments/cards are written at
 * trust boundaries (member purchase, finance verification) and the member must
 * NOT be able to self-activate. Entry points are server actions / route guards
 * only - never import this module from Client Components.
 */

export interface ActiveTier {
  id: string;
  code: string;
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'monthly' | 'annual';
  benefitsSummary: string[];
  sortOrder: number;
}

/* ------------------------------ Read-only ------------------------------ */

export async function listActiveTiers(): Promise<ActiveTier[]> {
  if (!adminConfigured()) return [];
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('membership_tiers')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !data) return [];

  return (data as unknown as Array<Record<string, unknown>>).map((t) => ({
    id: t.id as string,
    code: t.code as string,
    name: t.name as string,
    price: Number(t.price),
    currency: (t.currency as string).trim() || 'MWK',
    billingPeriod: t.billing_period === 'monthly' ? 'monthly' : 'annual',
    benefitsSummary: (t.benefits_summary ?? []) as string[],
    sortOrder: t.sort_order as number,
  }));
}

/* --------------------------- Purchase flow ------------------------------ */

export interface StartMembershipInput {
  profileId: string;
  profileEmail?: string | null;
  profileName?: string | null;
  tierCode: string;
  paymentMethod?: string;
  source?: 'web' | 'mobile' | 'pos';
}

export interface StartMembershipResult {
  membershipId: string;
  paymentId: string;
  reference: string;
  amount: number;
  currency: string;
  tierName: string;
}

/** Creates the pending_payment membership + a pending manual payment row. */
export async function startMembership(input: StartMembershipInput): Promise<StartMembershipResult> {
  if (!adminConfigured()) {
    throw new Error('Membership purchase is not configured yet.');
  }
  const supabase = createAdminClient();

  const { data: tier } = await supabase
    .from('membership_tiers')
    .select('id, code, name, price, currency, billing_period')
    .eq('code', input.tierCode)
    .eq('is_active', true)
    .maybeSingle();
  if (!tier) throw new Error('That tier is not available.');

  const { data: latest } = await supabase
    .from('memberships')
    .select('id, status')
    .eq('profile_id', input.profileId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (
    latest &&
    ['pending_payment', 'active', 'upgrading', 'pending'].includes(latest.status as string)
  ) {
    if (latest.status === 'active') {
      throw new Error('You already have an active membership.');
    }
    throw new Error('You already have a pending payment that needs verification.');
  }

  // Resolve the payment method against the configured list (default: bank transfer).
  let method = 'bank_transfer';
  if (input.paymentMethod) {
    // Inline default methods - bank transfer / mobile money.
    const defaultMethods: Record<string, { enabled: boolean; sort: number; instructions: string }> = {
      bank_transfer: { enabled: true, sort: 10, instructions: 'Deposit the amount into the FDH Bank account below and use your unique PY- reference as the deposit reference.' },
      tnm_mpamba: { enabled: true, sort: 20, instructions: 'Dial *444# and send the exact amount to the TNM Mpamba merchant number 432389.' },
      airtel_money: { enabled: true, sort: 30, instructions: 'Dial *333# and send the exact amount to the Airtel Money merchant number 10080128.' },
    };
    if (defaultMethods[input.paymentMethod]?.enabled) {
      method = input.paymentMethod;
    } else {
      throw new Error('That payment method is not available.');
    }
  }

  const { data: membership, error: membershipError } = await supabase
    .from('memberships')
    .insert({
      profile_id: input.profileId,
      tier_id: tier.id,
      status: 'pending_payment',
    })
    .select('id')
    .single();
  if (membershipError || !membership) throw new Error('Could not start your membership.');

  // Create payment reference.
  const reference = `PY-${crypto.getRandomValues(new Uint32Array(10))
    .map((i) => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[i % 32])
    .join('')}`;

  const { data: payment, error: paymentError } = await supabase
    .from('payments')
    .insert({
      profile_id: input.profileId,
      membership_id: membership.id,
      tier_id: tier.id,
      amount: Number(tier.price),
      currency: (tier.currency as string).trim() || 'MWK',
      method,
      status: 'pending',
      reference,
    })
    .select('id')
    .single();
  if (paymentError || !payment) throw new Error('Could not create the payment.');

  await supabase.from('membership_history').insert({
    membership_id: membership.id,
    profile_id: input.profileId,
    tier_id: tier.id,
    event_type: 'created',
    from_status: null,
    to_status: 'pending_payment',
    amount: Number(tier.price),
    payment_id: payment.id,
  });

  return {
    membershipId: membership.id,
    paymentId: payment.id,
    reference,
    amount: Number(tier.price),
    currency: (tier.currency as string).trim() || 'MWK',
    tierName: tier.name as string,
  };
}

/* ------------------------- Finance verification ------------------------- */

/** Approve or reject a pending manual payment. */
export async function verifyPayment(params: {
  paymentId: string;
  verifierId: string;
  verifierRole: string;
  approve: boolean;
  notes?: string;
}): Promise<void> {
  if (!adminConfigured()) {
    throw new Error('Payment processing is not configured yet.');
  }
  const supabase = createAdminClient();

  const { data: payment } = await supabase
    .from('payments')
    .select('id, profile_id, membership_id, tier_id, amount, currency, status, reference, method, payload')
    .eq('id', params.paymentId)
    .maybeSingle();
  if (!payment) throw new Error('Payment not found.');
  if (payment.status !== 'pending') throw new Error('This payment has already been reviewed.');

  const before = { status: payment.status };
  let activatedTierName = 'Ekhaya FC';

  if (params.approve) {
    const { data: tier } = await supabase
      .from('membership_tiers')
      .select('name, billing_period')
      .eq('id', payment.tier_id)
      .maybeSingle();
    if (tier?.name) activatedTierName = tier.name as string;
    const window = {
      startsAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { error: paymentError } = await supabase
      .from('payments')
      .update({ status: 'paid', paid_at: new Date().toISOString() })
      .eq('id', payment.id);
    if (paymentError) throw new Error('Could not mark the payment as paid.');

    const { error: membershipError } = await supabase
      .from('memberships')
      .update({
        status: 'active',
        starts_at: window.startsAt,
        ends_at: window.endsAt,
        current_period_start: window.startsAt,
        current_period_end: window.endsAt,
      })
      .eq('id', payment.membership_id);
    if (membershipError) throw new Error('Could not activate the membership.');

    await supabase.from('membership_history').insert({
      membership_id: payment.membership_id,
      profile_id: payment.profile_id,
      tier_id: payment.tier_id,
      event_type: 'activation',
      from_status: 'pending_payment',
      to_status: 'active',
      amount: Number(payment.amount),
      payment_id: payment.id,
      notes: params.notes || null,
    });

    await supabase.from('receipts').insert({
      payment_id: payment.id,
      receipt_number: `RCT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 89999)}`,
      issued_by: params.verifierId,
      payload: { method: payment.method ?? 'manual', notes: params.notes ?? null },
    });
  } else {
    await supabase
      .from('payments')
      .update({
        status: 'failed',
        payload: { ...((payment.payload as Record<string, unknown>) ?? {}), verified_at: new Date().toISOString() },
      })
      .eq('id', payment.id);
    await supabase
      .from('memberships')
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq('id', payment.membership_id);
    await supabase.from('membership_history').insert({
      membership_id: payment.membership_id,
      profile_id: payment.profile_id,
      tier_id: payment.tier_id,
      event_type: 'activation_rejected',
      from_status: 'pending_payment',
      to_status: 'cancelled',
      amount: Number(payment.amount),
      payment_id: payment.id,
      notes: params.notes || null,
    });
  }

  // Audit where possible.
  const isUuidLike = /^[0-9a-fA-F-]{36}$/.test(params.verifierId);
  if (isUuidLike) {
    await supabase.from('audit_logs').insert({
      actor_profile_id: params.verifierId,
      actor_role: params.verifierRole,
      action: params.approve ? 'payments.verify.approve' : 'payments.verify.reject',
      entity_type: 'payments',
      entity_id: payment.id,
      before,
      after: { status: params.approve ? 'paid' : 'failed' },
    });
  }

  // Essential notifications - best effort, never block verification.
  try {
    const amount = `MK ${Number(payment.amount).toLocaleString()}`;
    if (params.approve) {
      await supabase.from('notifications').insert({
        profile_id: payment.profile_id,
        channel: 'email',
        type: 'membership_activated',
        template_code: 'membership_activated',
        subject: 'Your Ekhaya FC membership is active',
        body: `Hi, your ${activatedTierName} membership is now active. Payment of ${amount} received (receipt issued). Find your digital card and member number in the app under Memberships.`,
      });
      await supabase.from('notifications').insert({
        profile_id: payment.profile_id,
        channel: 'sms',
        type: 'payment_received',
        template_code: 'payment_received',
        body: `Ekhaya FC: payment of ${amount} received. Your membership is active. Welcome to the club!`,
      });
    } else {
      await supabase.from('notifications').insert({
        profile_id: payment.profile_id,
        channel: 'email',
        type: 'payment_rejected',
        template_code: 'payment_rejected',
        subject: 'Payment not verified',
        body: `Hi, we could not verify your payment of ${amount} (reference ${payment.reference}). Please contact the membership office or try again.`,
      });
      await supabase.from('notifications').insert({
        profile_id: payment.profile_id,
        channel: 'sms',
        type: 'payment_rejected',
        template_code: 'payment_rejected',
        body: `Ekhaya FC: we could not verify your payment of ${amount} (ref ${payment.reference}). Contact the club or try again.`,
      });
    }
  } catch {
    /* delivery must never fail an approval */
  }
}

/* ------------------------------ Digital cards --------------------------- */

export interface CardRecord {
  id: string | null;
  memberNumber: string;
  memberNumberExists: boolean;
  cardNumber: string;
  tokenHash?: string;
  tierName?: string;
  endsAt?: string | null;
}

/** Insert a fresh card row or rotate the QR hash on the existing one. */
export async function saveCardToken(params: {
  profileId: string;
  membershipId: string;
  memberNumber: string;
  tokenHash: string;
}) {
  if (!adminConfigured()) {
    throw new Error('Card issuance is not configured yet.');
  }
  const supabase = createAdminClient();
  const cardNumber = generateCardNumber(params.memberNumber);

  const { data: existing } = await supabase
    .from('digital_cards')
    .select('id')
    .eq('profile_id', params.profileId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('digital_cards')
      .update({ qr_token_hash: params.tokenHash, last_refreshed_at: new Date().toISOString() })
      .eq('id', existing.id);
    if (error) throw new Error('Could not refresh your card.');
    return existing.id as string;
  }

  const { data: card, error } = await supabase
    .from('digital_cards')
    .insert({
      profile_id: params.profileId,
      membership_id: params.membershipId,
      member_number: params.memberNumber,
      card_number: cardNumber,
      qr_token_hash: params.tokenHash,
    })
    .select('id')
    .single();
  if (error || !card) throw new Error('Could not issue your card.');
  return card.id as string;
}

/** Snapshot the member number onto their current membership row. */
export async function attachMemberNumber(membershipId: string, memberNumber: string) {
  if (!adminConfigured()) return;
  await createAdminClient()
    .from('memberships')
    .update({ member_number: memberNumber })
    .eq('id', membershipId);
}