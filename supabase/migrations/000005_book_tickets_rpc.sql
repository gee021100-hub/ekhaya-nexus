-- Ekhaya App: atomic ticket booking.
-- Fans book through a single database function so availability is validated
-- and the sold count updated atomically under RLS. The stored allocation price
-- is authoritative — the booking form never supplies a price.

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
    (p_allocation_id, p_full_name, p_email, p_phone, p_quantity, v_total, v_reference, 'confirmed', CURRENT_DATE);

  UPDATE ticket_allocations
     SET sold   = COALESCE(sold, 0) + p_quantity,
         status = CASE WHEN v_remaining - p_quantity <= 0 THEN 'sold_out' ELSE status END
   WHERE id = p_allocation_id;

  RETURN jsonb_build_object(
    'ok', true,
    'reference', v_reference,
    'message', 'Tickets booked! Your reference is ' || v_reference || '.'
  );
END;
$$;

REVOKE ALL ON FUNCTION public.book_tickets(uuid, text, text, text, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.book_tickets(uuid, text, text, text, integer) TO anon, authenticated;