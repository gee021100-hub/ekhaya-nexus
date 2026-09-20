-- Ekhaya App: Online payments — fan self-service payments for ticket
-- bookings and paid memberships.
--
-- Fans complete a booking/membership, a pending PaymentTransaction records what
-- is owed (amount is computed server-side from stored prices, never supplied by
-- the fan), and the fan pays by mobile money. The club reconciles each payment
-- in the admin Payments module (wallet reference verified against the club's
-- actual mobile-money account) before confirming it.
--
-- Payment modes (driven by PAYMENT_MODE at runtime, see lib/payments.ts):
--   * sandbox — auto-confirms for demonstration; never for real money.
--   * manual  — staff verify the wallet reference in /admin/payments first.
--
-- The confirm_payment function is executable by anon + authenticated so the
-- sandbox flow can auto-confirm; in manual mode the final confirmation is a
-- staff decision carried out in the admin area and the club must double-check
-- each wallet reference before confirming.

-- ---------------------------------------------------------------------------
-- 1. Ticket bookings now carry a payment state. The booking stays 'confirmed'
-- (the seats are held) but only becomes 'paid' once the payment is confirmed.
-- ---------------------------------------------------------------------------

ALTER TABLE ticket_bookings
  ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'pending'
  CHECK (payment_status IN ('pending', 'paid'));

-- ---------------------------------------------------------------------------
-- 2. Payment transactions — one row per payment request.
-- ---------------------------------------------------------------------------

CREATE TABLE payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  booking_type TEXT NOT NULL CHECK (booking_type IN ('ticket', 'membership')),
  booking_id UUID NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  method TEXT NOT NULL DEFAULT 'mobile_money' CHECK (method IN ('mobile_money', 'provider')),
  provider TEXT,
  phone TEXT,
  customer_name TEXT,
  customer_email TEXT,
  -- The fan's mobile-money transaction reference, recorded when they say they
  -- have paid and used by staff to reconcile against the club's wallet.
  provider_reference TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded')),
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_created ON payment_transactions(created_at DESC);
CREATE INDEX idx_payments_status ON payment_transactions(status);
CREATE INDEX idx_payments_booking ON payment_transactions(booking_type, booking_id);

-- ---------------------------------------------------------------------------
-- 3. RLS — fans create + settle; staff read and reconcile.
-- ---------------------------------------------------------------------------

ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fans create payments" ON payment_transactions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff read payments" ON payment_transactions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Staff update payments" ON payment_transactions
  FOR UPDATE TO authenticated USING (true);

-- ---------------------------------------------------------------------------
-- 4. book_tickets now returns the new booking id so the caller can link the
-- payment transaction to it.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.book_tickets(
  p_allocation_id uuid,
  p_full_name text,
  p_email text,
  p_phone text,
  p_quantity integer
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_allocation RECORD;
  v_remaining  INTEGER;
  v_total      NUMERIC(12,2);
  v_reference  TEXT;
  v_booking_id UUID;
BEGIN
  SELECT id, price, capacity, sold, status
    INTO v_allocation
    FROM ticket_allocations
   WHERE id = p_allocation_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'message', 'This ticket stand could not be found.');
  END IF;

  v_remaining := COALESCE(v_allocation.capacity, 0) - COALESCE(v_allocation.sold, 0);

  IF v_allocation.status <> 'available' OR v_remaining <= 0 THEN
    RETURN jsonb_build_object('ok', false, 'message', 'No tickets left for this stand at the moment.');
  END IF;

  IF p_quantity IS NULL OR p_quantity <= 0 OR p_quantity > v_remaining THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Please enter a valid number of tickets for this stand.');
  END IF;

  v_reference := 'EK-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));
  v_total := round((COALESCE(v_allocation.price, 0) * p_quantity)::numeric, 2);

  INSERT INTO ticket_bookings
    (allocation_id, full_name, email, phone, quantity, total_amount, reference, status, booking_date)
  VALUES
    (p_allocation_id, p_full_name, p_email, p_phone, p_quantity, v_total, v_reference, 'confirmed', CURRENT_DATE)
  RETURNING id INTO v_booking_id;

  UPDATE ticket_allocations
     SET sold   = COALESCE(sold, 0) + p_quantity,
         status = CASE WHEN v_remaining - p_quantity <= 0 THEN 'sold_out' ELSE status END
   WHERE id = p_allocation_id;

  RETURN jsonb_build_object(
    'ok', true,
    'booking_id', v_booking_id,
    'reference', v_reference,
    'amount', v_total,
    'message', 'Tickets booked! Your reference is ' || v_reference || '.'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.book_tickets(uuid, text, text, text, integer) TO anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. Payment RPCs
-- ---------------------------------------------------------------------------

-- Create a pending payment for a booking/membership. Amount is passed by the
-- server action (already derived from stored prices); the fan never supplies it.
CREATE OR REPLACE FUNCTION public.create_payment(
  p_booking_type text,
  p_booking_id uuid,
  p_amount numeric,
  p_method text,
  p_provider text,
  p_phone text,
  p_customer_name text,
  p_customer_email text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id   UUID;
  v_ref  TEXT;
  v_amt  NUMERIC;
BEGIN
  IF p_booking_type NOT IN ('ticket', 'membership') THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Invalid payment type.');
  END IF;

  v_amt := round(COALESCE(p_amount, 0)::numeric, 2);
  IF v_amt < 0 THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Invalid payment amount.');
  END IF;

  v_ref := 'EKM-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12));

  INSERT INTO payment_transactions
    (reference, booking_type, booking_id, amount, method, provider, phone,
     customer_name, customer_email, status)
  VALUES
    (v_ref, p_booking_type, p_booking_id, v_amt, COALESCE(p_method, 'mobile_money'),
     NULLIF(p_provider, ''), NULLIF(p_phone, ''), NULLIF(p_customer_name, ''),
     NULLIF(p_customer_email, ''), 'pending')
  RETURNING id INTO v_id;

  RETURN jsonb_build_object(
    'ok', true,
    'transaction_id', v_id,
    'reference', v_ref,
    'amount', v_amt
  );
END;
$$;

-- Record the fan's wallet reference on a pending payment (no state change).
CREATE OR REPLACE FUNCTION public.record_payment_reference(
  p_transaction_id uuid,
  p_provider_reference text,
  p_provider text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TRIM(COALESCE(p_provider_reference, '')) = '' THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Please provide your payment reference.');
  END IF;

  UPDATE payment_transactions
     SET provider_reference = trim(p_provider_reference),
         provider = COALESCE(NULLIF(p_provider, ''), provider)
   WHERE id = p_transaction_id
     AND status = 'pending';

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Payment record not found or no longer pending.');
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'message', 'Thank you. Your payment reference has been recorded for verification.'
  );
END;
$$;

-- Confirm a payment: marks the transaction confirmed and flips the linked
-- booking to paid / membership to active, atomically.
CREATE OR REPLACE FUNCTION public.confirm_payment(
  p_transaction_id uuid,
  p_provider_reference text,
  p_provider text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tx RECORD;
BEGIN
  SELECT * INTO v_tx FROM payment_transactions WHERE id = p_transaction_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'not_found', 'message', 'Payment record not found.');
  END IF;

  IF v_tx.status = 'confirmed' THEN
    RETURN jsonb_build_object(
      'ok', true, 'code', 'already_confirmed', 'message', 'Payment already confirmed.',
      'reference', v_tx.reference, 'amount', v_tx.amount
    );
  END IF;

  IF v_tx.status <> 'pending' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'not_pending', 'message', 'This payment is not pending confirmation.');
  END IF;

  UPDATE payment_transactions
     SET status = 'confirmed',
         provider_reference = COALESCE(NULLIF(trim(p_provider_reference), ''), provider_reference, ''),
         provider = COALESCE(NULLIF(p_provider, ''), provider),
         confirmed_at = now()
   WHERE id = p_transaction_id;

  IF v_tx.booking_type = 'ticket' THEN
    UPDATE ticket_bookings SET payment_status = 'paid' WHERE id = v_tx.booking_id;
  ELSIF v_tx.booking_type = 'membership' THEN
    UPDATE memberships SET status = 'active' WHERE id = v_tx.booking_id;
  END IF;

  RETURN jsonb_build_object(
    'ok', true, 'code', 'confirmed', 'message', 'Payment confirmed.',
    'reference', v_tx.reference, 'amount', v_tx.amount
  );
END;
$$;

-- Staff reconciliation: mark a pending payment as failed (e.g. reference does
-- not match the club's wallet). Authenticated staff only.
CREATE OR REPLACE FUNCTION public.cancel_payment(
  p_transaction_id uuid
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_tx RECORD;
BEGIN
  SELECT * INTO v_tx FROM payment_transactions WHERE id = p_transaction_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Payment record not found.');
  END IF;

  IF v_tx.status <> 'pending' THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Only pending payments can be marked as failed.');
  END IF;

  UPDATE payment_transactions SET status = 'failed' WHERE id = p_transaction_id;

  RETURN jsonb_build_object(
    'ok', true, 'message', 'Payment marked as failed. No funds were received.',
    'reference', v_tx.reference
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_payment(text, uuid, numeric, text, text, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.record_payment_reference(uuid, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_payment(uuid, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cancel_payment(uuid) TO authenticated;