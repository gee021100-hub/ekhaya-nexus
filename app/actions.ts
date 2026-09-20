'use server';

import { createHash } from 'node:crypto';
import { createClient, supabaseConfigured } from '@/lib/supabase/server';
import { paymentMode } from '@/lib/payments';
import { rateLimit } from '@/lib/rate-limit';
import { logError } from '@/lib/telemetry';
import {
  emailConfigured,
  membershipEmail,
  sendEmail,
  ticketBookingEmail,
} from '@/lib/email';
import { isValidEmail } from '@/lib/utils';
import { MEMBERSHIP_TIERS, type PaymentMode, type PollVoteRow, type StoreOrderItem } from '@/types';

/* ------------------------------------------------------------------ */
/*  Shared fan-action result types                                     */
/* ------------------------------------------------------------------ */

export interface FanPaymentInfo {
  /** payment_transactions.id */
  transactionId: string;
  /** Public display reference the fan should quote when paying (EKM-…). */
  reference: string;
  /** Amount due in MK. */
  amount: number;
  mode: PaymentMode;
}

export interface FanActionResult {
  success: boolean;
  message: string;
  /** Booking reference (tickets only, EK-…). */
  reference?: string;
  /** Present when a payment must still be completed. */
  payment?: FanPaymentInfo | null;
}

/** RPC result shape shared by create/record/confirm/cancel payment functions. */
type PaymentRpcResult = {
  ok?: boolean;
  transaction_id?: string;
  reference?: string;
  amount?: number;
  message?: string;
} | null;

async function createPaymentFor(
  supabase: Awaited<ReturnType<typeof createClient>>,
  bookingType: 'ticket' | 'membership' | 'store',
  bookingId: string,
  amount: number,
  phone: string | null,
  name: string,
  email: string,
): Promise<FanPaymentInfo | null> {
  if (!amount || amount <= 0) return null;
  const { data } = await supabase.rpc('create_payment', {
    p_booking_type: bookingType,
    p_booking_id: bookingId,
    p_amount: amount,
    p_method: 'mobile_money',
    p_provider: null,
    p_phone: phone,
    p_customer_name: name,
    p_customer_email: email,
  });
  const payment = data as PaymentRpcResult;
  if (!payment?.ok || !payment.transaction_id) return null;
  return {
    transactionId: payment.transaction_id,
    reference: payment.reference ?? '',
    amount: Number(payment.amount ?? amount),
    mode: paymentMode(),
  };
}

/* ------------------------------------------------------------------ */
/*  Ticket booking                                                     */
/* ------------------------------------------------------------------ */

const RATE_LIMITED_MESSAGE =
  'Too many attempts — please wait a moment and try again.';
const MAX_NAME = 120;
const MAX_PHONE = 40;

export async function bookTickets(
  _prev: FanActionResult | null,
  formData: FormData,
): Promise<FanActionResult> {
  if (!(await rateLimit('booking'))) {
    return { success: false, message: RATE_LIMITED_MESSAGE };
  }

  const fullName = String(formData.get('full_name') ?? '').trim().slice(0, MAX_NAME);
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const quantity = Number(formData.get('quantity')) || 0;
  const allocationId = String(formData.get('allocation_id') ?? '').trim() || null;
  const phone = String(formData.get('phone') ?? '').trim().slice(0, MAX_PHONE) || null;

  if (!fullName || !email || quantity <= 0) {
    return {
      success: false,
      message: 'Please provide your name, email address and at least one ticket.',
    };
  }
  if (!isValidEmail(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  if (quantity > 50) {
    return { success: false, message: 'Please enter a valid number of tickets.' };
  }
  if (!allocationId) {
    return { success: false, message: 'Please select a ticket stand before booking.' };
  }

  if (!supabaseConfigured()) {
    return {
      success: false,
      message:
        'Database not connected. Add the Supabase environment variables to complete your booking.',
    };
  }

  // Booking runs through the book_tickets database function, which validates
  // availability, uses the stored price (never the form), books the tickets and
  // increments the sold count atomically.
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('book_tickets', {
    p_allocation_id: allocationId,
    p_full_name: fullName,
    p_email: email,
    p_phone: phone,
    p_quantity: quantity,
  });
  if (error) {
    void logError('actions:bookTickets', error);
    return { success: false, message: 'Could not complete your booking. Please try again.' };
  }
  const result = (data ?? {}) as {
    ok?: boolean;
    booking_id?: string;
    reference?: string;
    amount?: number;
    message?: string;
  };
  if (!result.ok) {
    return { success: false, message: result.message ?? 'Could not complete your booking.' };
  }

  const amount = Number(result.amount ?? 0);
  const bookingId = result.booking_id ?? '';
  const payment = bookingId
    ? await createPaymentFor(supabase, 'ticket', bookingId, amount, phone, fullName, email)
    : null;

  if (emailConfigured()) {
    const { data: allocation } = await supabase
      .from('ticket_allocations')
      .select('category, fixture_name')
      .eq('id', allocationId)
      .single();
    const message = ticketBookingEmail({
      email,
      fullName,
      reference: result.reference ?? bookingId,
      amount: payment?.amount ?? amount,
      category: allocation?.category ?? 'Match ticket',
      quantity,
    });
    void sendEmail({ to: email, ...message }).then((res) => {
      if (!res.ok) void logError('email:booking', new Error(res.error ?? 'send failed'));
    });
  }

  return {
    success: true,
    reference: result.reference,
    message: payment
      ? `${result.message ?? 'Tickets booked!'} Complete your payment to confirm.`
      : (result.message ?? 'Tickets booked!'),
    payment,
  };
}

/* ------------------------------------------------------------------ */
/*  Fan membership                                                     */
/* ------------------------------------------------------------------ */

export async function submitMembership(
  _prev: FanActionResult | null,
  formData: FormData,
): Promise<FanActionResult> {
  if (!(await rateLimit('membership'))) {
    return { success: false, message: RATE_LIMITED_MESSAGE };
  }

  const fullName = String(formData.get('full_name') ?? '').trim().slice(0, MAX_NAME);
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const member_type = String(formData.get('member_type') ?? '').trim();

  if (!fullName || !email || !member_type) {
    return {
      success: false,
      message: 'Please provide your name, email address and membership type.',
    };
  }
  if (!isValidEmail(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  const tier = MEMBERSHIP_TIERS.find((t) => t.slug === member_type);
  if (!tier) {
    return { success: false, message: 'Please choose a valid membership type.' };
  }

  if (!supabaseConfigured()) {
    return {
      success: false,
      message:
        'Database not connected. Add the Supabase environment variables to join as a member.',
    };
  }

  const supabase = await createClient();
  // Paid tiers (Gold, Family) stay pending until the payment is confirmed.
  // Supporter is free and becomes active immediately; Corporate is handled
  // directly with the club and stays pending.
  const status: 'active' | 'pending' =
    member_type === 'supporter' ? 'active' : 'pending';

  // The id is generated here so we can link the payment without a SELECT back
  // (memberships are insert-only for anonymous fans — reads are staff-only).
  const membershipId = crypto.randomUUID();
  const { error } = await supabase.from('memberships').insert({
    id: membershipId,
    full_name: fullName,
    email,
    phone: String(formData.get('phone') ?? '').trim().slice(0, MAX_PHONE) || null,
    member_type,
    status,
  });
  if (error) {
    void logError('actions:submitMembership', error);
    return { success: false, message: 'Could not complete your membership. Please try again.' };
  }

  const priceValue = tier.priceValue ?? 0;
  const payment =
    priceValue > 0
      ? await createPaymentFor(
          supabase,
          'membership',
          membershipId,
          priceValue,
          String(formData.get('phone') ?? '').trim() || null,
          fullName,
          email,
        )
      : null;

  if (emailConfigured()) {
    const message = membershipEmail({
      email,
      fullName,
      tierName: tier.name,
      amount: payment?.amount ?? priceValue,
      reference: payment?.reference ?? membershipId.slice(0, 8).toUpperCase(),
    });
    void sendEmail({ to: email, ...message }).then((res) => {
      if (!res.ok) void logError('email:membership', new Error(res.error ?? 'send failed'));
    });
  }

  return {
    success: true,
    message: payment
      ? 'Welcome to Ekhaya FC! Complete your payment to activate your membership.'
      : 'Welcome to Ekhaya FC! Your membership application has been received.',
    payment,
  };
}

/* ------------------------------------------------------------------ */
/*  Official store checkout                                            */
/* ------------------------------------------------------------------ */

const MAX_CART_LINES = 20;
const MAX_LINE_QUANTITY = 10;
const MAX_CUSTOM_TEXT = 60;

export interface StoreCheckoutLine {
  productId: string;
  size: string | null;
  customText: string | null;
  quantity: number;
}

export async function checkoutStoreOrder(
  _prev: FanActionResult | null,
  formData: FormData,
): Promise<FanActionResult> {
  if (!(await rateLimit('store'))) {
    return { success: false, message: RATE_LIMITED_MESSAGE };
  }

  // Honeypot: real users never see this hidden field.
  if (String(formData.get('website') ?? '') !== '') {
    return { success: false, message: 'Checkout failed. Please try again.' };
  }

  const fullName = String(formData.get('full_name') ?? '').trim().slice(0, MAX_NAME);
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const phone = String(formData.get('phone') ?? '').trim().slice(0, MAX_PHONE) || null;
  const deliveryOption = String(formData.get('delivery_option') ?? 'blantyre_pickup').trim();

  if (!fullName || !email) {
    return { success: false, message: 'Please provide your name and email address.' };
  }
  if (!isValidEmail(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  let lines: StoreCheckoutLine[];
  try {
    lines = JSON.parse(String(formData.get('items') ?? '{}')) as StoreCheckoutLine[];
  } catch {
    return { success: false, message: 'Your cart could not be read. Please try again.' };
  }
  if (!Array.isArray(lines) || lines.length === 0) {
    return { success: false, message: 'Your cart is empty.' };
  }
  if (lines.length > MAX_CART_LINES) {
    return { success: false, message: 'Too many items in your cart.' };
  }
  for (const l of lines) {
    if (!l.productId || !Number.isInteger(l.quantity) || l.quantity <= 0) {
      return { success: false, message: 'Your cart contains an invalid item.' };
    }
    if (l.quantity > MAX_LINE_QUANTITY) {
      return { success: false, message: 'Please reduce the quantity for one of your items.' };
    }
  }

  if (!supabaseConfigured()) {
    return {
      success: false,
      message:
        'Database not connected. Add the Supabase environment variables to check out.',
    };
  }

  // Pricing is always recomputed server-side from the stored product prices —
  // the client never dictates amounts.
  const supabase = await createClient();
  const productIds = [...new Set(lines.map((l) => l.productId))];
  const { data: products } = await supabase
    .from('store_products')
    .select('id, name, category, price, sizes, customizable, in_stock, enabled')
    .in('id', productIds);
  if (!products) {
    void logError('actions:checkoutStoreOrder', new Error('products lookup failed'));
    return { success: false, message: 'Could not verify your cart. Please try again.' };
  }
  const byId = new Map(
    (products as { id: string; name: string; category: string; price: number | null; sizes: string[]; customizable: boolean; in_stock: boolean; enabled: boolean }[]).map(
      (p) => [p.id, p],
    ),
  );

  const items: StoreOrderItem[] = [];
  let subtotal = 0;
  for (const l of lines) {
    const product = byId.get(l.productId);
    if (!product || !product.enabled || !product.in_stock || product.price == null) {
      return {
        success: false,
        message: 'One of your items is no longer available. Please refresh your cart.',
      };
    }
    const size = l.size ?? null;
    if (size && product.sizes.length > 0 && !product.sizes.includes(size)) {
      return { success: false, message: `Invalid size for ${product.name}.` };
    }
    if (l.customText && !product.customizable) {
      return { success: false, message: `${product.name} cannot be personalised.` };
    }
    const lineTotal = Number(product.price) * l.quantity;
    subtotal += lineTotal;
    items.push({
      product_id: product.id,
      name: product.name,
      category: product.category,
      size,
      custom_text: l.customText ? l.customText.slice(0, MAX_CUSTOM_TEXT) : null,
      unit_price: Number(product.price),
      quantity: l.quantity,
    });
  }

  const orderReference = `EKO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const orderId = crypto.randomUUID();
  const { error: orderError } = await supabase.from('store_orders').insert({
    id: orderId,
    reference: orderReference,
    items,
    subtotal,
    discount: 0,
    total: subtotal,
    delivery_option: deliveryOption,
    customer_name: fullName,
    customer_email: email,
    customer_phone: phone,
    payment_status: subtotal > 0 ? 'pending' : 'paid',
  });
  if (orderError) {
    void logError('actions:checkoutStoreOrder', orderError);
    return { success: false, message: 'Could not place your order. Please try again.' };
  }

  const payment =
    subtotal > 0
      ? await createPaymentFor(supabase, 'store', orderId, subtotal, phone, fullName, email)
      : null;

  if (emailConfigured()) {
    void sendEmail({
      to: email,
      subject: `Your Ekhaya FC store order — ${orderReference}`,
      text: `Hi ${fullName},\n\nThank you for shopping at the Ekhaya FC store. Your order ${orderReference} has been received (${items.length} item${items.length === 1 ? '' : 's'}, MK ${subtotal.toLocaleString()}).\n\nComplete your payment to confirm, and we will have your items ready for pickup.\n\nEkhaya FC`,
    }).then((res) => {
      if (!res.ok) void logError('email:store', new Error(res.error ?? 'send failed'));
    });
  }

  return {
    success: true,
    reference: orderReference,
    message: payment
      ? 'Your order has been placed. Complete your payment to confirm it.'
      : 'Your order has been placed.',
    payment,
  };
}

/* ------------------------------------------------------------------ */
/*  Fan engagement: polls                                              */
/* ------------------------------------------------------------------ */

const POLL_VOTE_SALT = process.env.POLL_VOTE_SALT ?? 'ekhaya-poll-salt';

export interface FanVoteResult {
  success: boolean;
  message: string;
  points?: number;
  results?: PollVoteRow[];
}

export async function castFanVote(
  _prev: FanVoteResult | null,
  formData: FormData,
): Promise<FanVoteResult> {
  if (!(await rateLimit('poll'))) {
    return { success: false, message: RATE_LIMITED_MESSAGE };
  }

  // Honeypot: real users never see this hidden field.
  if (String(formData.get('website') ?? '') !== '') {
    return { success: false, message: 'Vote recorded.' };
  }

  const pollId = String(formData.get('poll_id') ?? '').trim();
  const optionId = String(formData.get('option_id') ?? '').trim();
  const visitor = String(formData.get('visitor') ?? '').trim();

  if (!pollId || !optionId || !visitor) {
    return { success: false, message: 'Please choose an option to vote.' };
  }
  if (visitor.length < 8 || visitor.length > 128) {
    return { success: false, message: 'Vote identifier missing.' };
  }

  if (!supabaseConfigured()) {
    return { success: false, message: 'Database not connected. Please try again.' };
  }

  // Server-side hash of the device id so raw visitor tokens never reach the DB.
  const hashedVisitor = createHash('sha256')
    .update(`${visitor}:${POLL_VOTE_SALT}`)
    .digest('hex');

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('cast_poll_vote', {
    p_poll_id: pollId,
    p_option_id: optionId,
    p_visitor: hashedVisitor,
  });
  if (error) {
    void logError('actions:castFanVote', error);
    return { success: false, message: 'Could not record your vote. Please try again.' };
  }
  const result = (data ?? {}) as {
    ok?: boolean;
    points?: number;
    results?: PollVoteRow[];
    message?: string;
  };
  if (!result.ok) {
    return {
      success: false,
      message: result.message ?? 'Could not record your vote.',
    };
  }

  return {
    success: true,
    points: result.points ?? 0,
    results: result.results ?? [],
    message: result.message ?? 'Vote recorded!',
  };
}

/* ------------------------------------------------------------------ */
/*  Payment completion                                                 */
/* ------------------------------------------------------------------ */

export async function submitPaymentReference(
  _prev: FanActionResult | null,
  formData: FormData,
): Promise<FanActionResult> {
  if (!(await rateLimit('booking'))) {
    return { success: false, message: RATE_LIMITED_MESSAGE };
  }

  const transactionId = String(formData.get('transaction_id') ?? '').trim();
  const providerReference = String(formData.get('provider_reference') ?? '').trim().slice(0, 120);
  const provider = String(formData.get('provider') ?? 'mpamba').trim();

  if (!transactionId || !providerReference) {
    return {
      success: false,
      message: 'Please provide a payment reference so the club can verify your payment.',
    };
  }

  if (!supabaseConfigured()) {
    const mode = paymentMode();
    // No database yet — simulate the payment so the flow stays clickable in
    // demo mode; manual mode still reports the reference as recorded.
    return mode === 'manual'
      ? {
          success: true,
          message:
            'Payment reference recorded (in-memory). Staff will confirm it once the database is connected.',
        }
      : {
          success: true,
          message:
            'Demo payment confirmed (in-memory). Connect Supabase to record real payments.',
        };
  }

  const supabase = await createClient();
  const mode = paymentMode();
  const rpc =
    mode === 'manual' ? 'record_payment_reference' : 'confirm_payment';
  const { data, error } = await supabase.rpc(rpc, {
    p_transaction_id: transactionId,
    p_provider_reference: providerReference,
    p_provider: provider === 'airtel' ? 'Airtel Money' : 'Mpamba',
  });
  if (error) {
    void logError('actions:submitPaymentReference', error, { data: { transactionId, mode } });
    return {
      success: false,
      message: 'Could not record your payment. Please try again.',
    };
  }
  const result = (data ?? {}) as { ok?: boolean; message?: string; reference?: string };

  return {
    success: Boolean(result.ok),
    reference: result.reference,
    message:
      result.message ??
      (mode === 'manual'
        ? 'Payment reference recorded for verification.'
        : 'Payment confirmed. Thank you!'),
    payment: mode === 'manual' ? { transactionId, reference: result.reference ?? '', amount: 0, mode } : null,
  };
}

/* ------------------------------------------------------------------ */
/*  Contact form                                                       */
/* ------------------------------------------------------------------ */

export async function submitContact(
  _prev: FanActionResult | null,
  formData: FormData,
): Promise<FanActionResult> {
  if (!(await rateLimit('contact'))) {
    return { success: false, message: RATE_LIMITED_MESSAGE };
  }

  const name = String(formData.get('name') ?? '').trim().slice(0, MAX_NAME);
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const subject = String(formData.get('subject') ?? '').trim().slice(0, 200) || null;
  const message = String(formData.get('message') ?? '').trim().slice(0, 5000);

  // Honeypot: real users never see or fill this hidden field. Automated
  // spam bots do, so a filled value means the submission is dropped quietly.
  if (String(formData.get('website') ?? '') !== '') {
    return {
      success: true,
      message: 'Thank you! Your message has been received and the club will get back to you.',
    };
  }

  if (!name || !email || !message) {
    return {
      success: false,
      message: 'Please provide your name, email address and a message.',
    };
  }
  if (!isValidEmail(email)) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  if (message.length < 10) {
    return { success: false, message: 'Please write a slightly longer message.' };
  }

  if (!supabaseConfigured()) {
    return {
      success: false,
      message:
        'Database not connected. Add the Supabase environment variables to send a message.',
    };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .insert({ name, email, subject, message, status: 'new' });
  if (error) {
    void logError('actions:submitContact', error);
    return { success: false, message: 'Could not send your message. Please try again.' };
  }

  if (emailConfigured()) {
    void sendEmail({
      to: email,
      subject: `We received your message, ${name}`,
      text: `Hi ${name},\n\nThanks for reaching out to Ekhaya FC. We have received your message and the club will get back to you as soon as possible.\n\nYour message:\n${message}`,
    }).then((res) => {
      if (!res.ok) void logError('email:contact', new Error(res.error ?? 'send failed'));
    });
  }

  return {
    success: true,
    message: 'Thank you! Your message has been received and the club will get back to you.',
  };
}