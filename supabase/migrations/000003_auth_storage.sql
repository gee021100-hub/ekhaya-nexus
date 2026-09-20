-- Ekhaya App: Supabase Auth + Storage wiring and RLS hardening.
-- Run after 000000 (core), 000001 (admin) and 000002 (digital).
--
-- Auth: staff sign in through Supabase Auth at /admin/login. Admin tables
-- therefore no longer allow anonymous writes; they require an authenticated
-- user. Core tables keep public SELECT only. Fan self-service inserts
-- (ticket bookings, memberships) stay public.
--
-- Storage: the `ekhaya-media` public bucket holds photos and match
-- highlights uploaded from the Media admin form.

/* ------------------------------------------------------------------ */
/*  Storage bucket for club media                                      */
/* ------------------------------------------------------------------ */

INSERT INTO storage.buckets (id, name, public)
VALUES ('ekhaya-media', 'ekhaya-media', true)
ON CONFLICT (id) DO NOTHING;

-- Public files are served through the public URL; only signed-in staff can
-- upload, replace or delete objects in the bucket.
DROP POLICY IF EXISTS "Staff upload ekhaya-media" ON storage.objects;
CREATE POLICY "Staff upload ekhaya-media" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'ekhaya-media');

DROP POLICY IF EXISTS "Staff update ekhaya-media" ON storage.objects;
CREATE POLICY "Staff update ekhaya-media" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'ekhaya-media');

DROP POLICY IF EXISTS "Staff delete ekhaya-media" ON storage.objects;
CREATE POLICY "Staff delete ekhaya-media" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'ekhaya-media');

/* ------------------------------------------------------------------ */
/*  Core tables: enable RLS with public read, no anonymous writes      */
/* ------------------------------------------------------------------ */

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;
ALTER TABLE fixtures ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read teams" ON teams;
CREATE POLICY "Public read teams" ON teams FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read players" ON players;
CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read competitions" ON competitions;
CREATE POLICY "Public read competitions" ON competitions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read standings" ON standings;
CREATE POLICY "Public read standings" ON standings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read fixtures" ON fixtures;
CREATE POLICY "Public read fixtures" ON fixtures FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public read results" ON results;
CREATE POLICY "Public read results" ON results FOR SELECT USING (true);

/* ------------------------------------------------------------------ */
/*  Admin tables: drop anonymous write, require a signed-in user       */
/* ------------------------------------------------------------------ */

DROP POLICY IF EXISTS "Public read registrations" ON registrations;
DROP POLICY IF EXISTS "Public insert registrations" ON registrations;
CREATE POLICY "Authenticated read registrations" ON registrations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert registrations" ON registrations
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public read transfers" ON transfers;
DROP POLICY IF EXISTS "Public insert transfers" ON transfers;
CREATE POLICY "Authenticated read transfers" ON transfers
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert transfers" ON transfers
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public read weekly_budgets" ON weekly_budgets;
DROP POLICY IF EXISTS "Public insert weekly_budgets" ON weekly_budgets;
CREATE POLICY "Authenticated read weekly_budgets" ON weekly_budgets
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert weekly_budgets" ON weekly_budgets
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public read budget_items" ON budget_items;
DROP POLICY IF EXISTS "Public insert budget_items" ON budget_items;
CREATE POLICY "Authenticated read budget_items" ON budget_items
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert budget_items" ON budget_items
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public read petty_cash_transactions" ON petty_cash_transactions;
DROP POLICY IF EXISTS "Public insert petty_cash_transactions" ON petty_cash_transactions;
CREATE POLICY "Authenticated read petty_cash_transactions" ON petty_cash_transactions
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert petty_cash_transactions" ON petty_cash_transactions
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public read staff_allowances" ON staff_allowances;
DROP POLICY IF EXISTS "Public insert staff_allowances" ON staff_allowances;
CREATE POLICY "Authenticated read staff_allowances" ON staff_allowances
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert staff_allowances" ON staff_allowances
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public read training_allocations" ON training_allocations;
DROP POLICY IF EXISTS "Public insert training_allocations" ON training_allocations;
CREATE POLICY "Authenticated read training_allocations" ON training_allocations
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated insert training_allocations" ON training_allocations
  FOR INSERT TO authenticated WITH CHECK (true);

/* ------------------------------------------------------------------ */
/*  Digital tables: staff content needs auth, fan self-service is null */
/* ------------------------------------------------------------------ */

-- News, media and ticket allocations are authored by staff; public read.
DROP POLICY IF EXISTS "Public insert news_articles" ON news_articles;
CREATE POLICY "Authenticated insert news_articles" ON news_articles
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert media_items" ON media_items;
CREATE POLICY "Authenticated insert media_items" ON media_items
  FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert ticket_allocations" ON ticket_allocations;
CREATE POLICY "Authenticated insert ticket_allocations" ON ticket_allocations
  FOR INSERT TO authenticated WITH CHECK (true);

-- Ticket bookings and memberships carry fan data; anyone can submit them,
-- only signed-in staff can read them back.
DROP POLICY IF EXISTS "Public read ticket_bookings" ON ticket_bookings;
CREATE POLICY "Authenticated read ticket_bookings" ON ticket_bookings
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "Public read memberships" ON memberships;
CREATE POLICY "Authenticated read memberships" ON memberships
  FOR SELECT TO authenticated USING (true);