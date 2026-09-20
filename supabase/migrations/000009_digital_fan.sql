-- Ekhaya App: Digital fan modules — Official Store, Fan Engagement polls and
-- the club notification broadcast tray. Also extends online payments to cover
-- store orders.
--
-- Follows the platform convention: staff-managed content (store products,
-- polls, notifications) starts empty and is entered through the admin area.
-- Fans self-serve checkout and voting through the public pages; like ticket
-- bookings and memberships, order/vote rows accept anonymous inserts but only
-- signed-in staff can read them back.

/* ------------------------------------------------------------------ */
/*  1. store_products — merchandise catalogue (staff-managed)          */
/* ------------------------------------------------------------------ */

CREATE TABLE store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Kits', 'Training', 'Fashion', 'Accessories', 'Collectibles')),
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  original_price NUMERIC(12,2),
  description TEXT,
  image_url TEXT,
  sizes TEXT[] NOT NULL DEFAULT '{}',
  customizable BOOLEAN NOT NULL DEFAULT false,
  in_stock BOOLEAN NOT NULL DEFAULT true,
  badge TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_store_products_catalog ON store_products(enabled, sort_order);

/* ------------------------------------------------------------------ */
/*  2. store_orders — fan self-service checkout                        */
/* ------------------------------------------------------------------ */

CREATE TABLE store_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference TEXT NOT NULL UNIQUE,
  items JSONB NOT NULL,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  delivery_option TEXT NOT NULL DEFAULT 'blantyre_pickup',
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_store_orders_created ON store_orders(created_at DESC);
CREATE INDEX idx_store_orders_payment ON store_orders(payment_status);

/* ------------------------------------------------------------------ */
/*  3. fan_polls + poll_votes — one vote per device                    */
/* ------------------------------------------------------------------ */

CREATE TABLE fan_polls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Match Prediction'
    CHECK (category IN ('Match Prediction', 'Team Performance', 'Player of the Week', 'Tactics & Coach', 'Club Future')),
  description TEXT,
  options JSONB NOT NULL,
  featured_match TEXT,
  active BOOLEAN NOT NULL DEFAULT true,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_fan_polls_catalog ON fan_polls(active, created_at DESC);

CREATE TABLE poll_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poll_id UUID NOT NULL REFERENCES fan_polls(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  visitor TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (poll_id, visitor)
);

CREATE INDEX idx_poll_votes_poll ON poll_votes(poll_id);

/* ------------------------------------------------------------------ */
/*  4. fan_notifications — club broadcasts (tray)                      */
/* ------------------------------------------------------------------ */

CREATE TABLE fan_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'news'
    CHECK (category IN ('match', 'news', 'ticket', 'store', 'admin')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_fan_notifications_catalog ON fan_notifications(published_at DESC);

/* ------------------------------------------------------------------ */
/*  5. RLS                                                             */
/* ------------------------------------------------------------------ */

ALTER TABLE store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE fan_notifications ENABLE ROW LEVEL SECURITY;

-- Shop catalogue: public read, staff writes (like news/ticket allocations).
CREATE POLICY "Public read store_products" ON store_products
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff insert store_products" ON store_products
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff update store_products" ON store_products
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff delete store_products" ON store_products
  FOR DELETE TO authenticated USING (true);

-- Orders: fans create, staff read/update (trust model like ticket_bookings).
CREATE POLICY "Fans create store_orders" ON store_orders
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff read store_orders" ON store_orders
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff update store_orders" ON store_orders
  FOR UPDATE TO authenticated USING (true);

-- Polls: staff author, public votes through the cast_poll_vote function.
CREATE POLICY "Public read fan_polls" ON fan_polls
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff insert fan_polls" ON fan_polls
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff update fan_polls" ON fan_polls
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff delete fan_polls" ON fan_polls
  FOR DELETE TO authenticated USING (true);

-- Votes are written by the public through cast_poll_vote; only staff read.
CREATE POLICY "Record poll votes" ON poll_votes
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Staff read poll_votes" ON poll_votes
  FOR SELECT TO authenticated USING (true);

-- Notifications: public read, staff author.
CREATE POLICY "Public read fan_notifications" ON fan_notifications
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Staff insert fan_notifications" ON fan_notifications
  FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff update fan_notifications" ON fan_notifications
  FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff delete fan_notifications" ON fan_notifications
  FOR DELETE TO authenticated USING (true);

/* ------------------------------------------------------------------ */
/*  6. Poll voting RPCs (SECURITY DEFINER, like book_tickets)          */
/* ------------------------------------------------------------------ */

-- Running totals for a poll. Public + staff.
CREATE OR REPLACE FUNCTION public.get_poll_results(p_poll_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_totals jsonb;
BEGIN
  SELECT jsonb_agg(
           jsonb_build_object('option_id', option_id, 'votes', votes)
           ORDER BY votes DESC
         )
    INTO v_totals
    FROM (
      SELECT option_id, COUNT(*) AS votes
        FROM poll_votes
       WHERE poll_id = p_poll_id
       GROUP BY option_id
    ) s;

  RETURN COALESCE(v_totals, '[]'::jsonb);
END;
$$;

-- Cast a vote. Validates the poll is active and the option exists, enforces
-- one vote per device (visitor hash), then returns the updated totals.
CREATE OR REPLACE FUNCTION public.cast_poll_vote(
  p_poll_id uuid,
  p_option_id text,
  p_visitor text
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_poll RECORD;
BEGIN
  SELECT * INTO v_poll FROM fan_polls WHERE id = p_poll_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'not_found', 'message', 'Poll not found.');
  END IF;

  IF NOT v_poll.active THEN
    RETURN jsonb_build_object('ok', false, 'code', 'closed', 'message', 'This poll has closed.');
  END IF;

  IF COALESCE(NULLIF(p_visitor, ''), '') = '' OR length(p_visitor) < 8 THEN
    RETURN jsonb_build_object('ok', false, 'code', 'bad_visitor', 'message', 'Vote identifier missing.');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM jsonb_array_elements(v_poll.options) AS o
     WHERE (o->>'id') = p_option_id
  ) THEN
    RETURN jsonb_build_object('ok', false, 'code', 'bad_option', 'message', 'Please choose a valid option.');
  END IF;

  INSERT INTO poll_votes (poll_id, option_id, visitor)
  VALUES (p_poll_id, p_option_id, left(p_visitor, 64));

  RETURN jsonb_build_object(
    'ok', true,
    'points', 5,
    'message', 'Vote recorded! +5 Khaya points.',
    'results', (SELECT public.get_poll_results(p_poll_id))
  );
EXCEPTION WHEN unique_violation THEN
  RETURN jsonb_build_object('ok', false, 'code', 'already_voted', 'message', 'You have already voted in this poll.');
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_poll_results(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.cast_poll_vote(uuid, text, text) TO anon, authenticated;

/* ------------------------------------------------------------------ */
/*  7. Payments: extend to cover store orders                          */
/* ------------------------------------------------------------------ */

ALTER TABLE payment_transactions
  DROP CONSTRAINT payment_transactions_booking_type_check;

ALTER TABLE payment_transactions
  ADD CONSTRAINT payment_transactions_booking_type_check
  CHECK (booking_type IN ('ticket', 'membership', 'store'));

-- create_payment: allow the 'store' booking type.
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
  IF p_booking_type NOT IN ('ticket', 'membership', 'store') THEN
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

-- confirm_payment: also flips a store order to paid.
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
  ELSIF v_tx.booking_type = 'store' THEN
    UPDATE store_orders SET payment_status = 'paid' WHERE id = v_tx.booking_id;
  END IF;

  RETURN jsonb_build_object(
    'ok', true, 'code', 'confirmed', 'message', 'Payment confirmed.',
    'reference', v_tx.reference, 'amount', v_tx.amount
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.create_payment(text, uuid, numeric, text, text, text, text, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_payment(uuid, text, text) TO anon, authenticated;