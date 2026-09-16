-- Ekhaya All-in-One: Administration schema
-- Player registration, transfers, weekly budgets, petty cash,
-- staff allowances and training allocations.

-- Player registrations
CREATE TABLE registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  position TEXT,
  date_of_birth DATE,
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  fee_amount NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_registrations_team ON registrations(team_id);
CREATE INDEX idx_registrations_date ON registrations(registration_date);

-- Transfers
CREATE TABLE transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  player_name TEXT NOT NULL,
  transfer_type TEXT NOT NULL CHECK (transfer_type IN ('in', 'out')),
  other_club TEXT NOT NULL,
  transfer_date DATE NOT NULL,
  fee_amount NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transfers_team ON transfers(team_id);
CREATE INDEX idx_transfers_date ON transfers(transfer_date);

-- Weekly budgets
CREATE TABLE weekly_budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_start DATE NOT NULL,
  week_end DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'approved', 'paid')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Budget line items
CREATE TABLE budget_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id UUID NOT NULL REFERENCES weekly_budgets(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  description TEXT,
  planned_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  actual_amount NUMERIC(12,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_budget_items_budget ON budget_items(budget_id);

-- Petty cash transactions
CREATE TABLE petty_cash_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_date DATE NOT NULL DEFAULT CURRENT_DATE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('in', 'out')),
  description TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  category TEXT,
  requestor TEXT,
  approved_by TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_petty_cash_date ON petty_cash_transactions(transaction_date);

-- Staff allowances
CREATE TABLE staff_allowances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  staff_name TEXT NOT NULL,
  role TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_staff_allowances_team ON staff_allowances(team_id);

-- Training allocations
CREATE TABLE training_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  training_date DATE NOT NULL,
  location TEXT,
  session_type TEXT,
  description TEXT,
  players_invited INTEGER,
  budget_amount NUMERIC(12,2),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_training_allocations_team ON training_allocations(team_id);
CREATE INDEX idx_training_allocations_date ON training_allocations(training_date);

-- Enable RLS on all admin tables
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE petty_cash_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_allowances ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_allocations ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read registrations" ON registrations FOR SELECT USING (true);
CREATE POLICY "Public read transfers" ON transfers FOR SELECT USING (true);
CREATE POLICY "Public read weekly_budgets" ON weekly_budgets FOR SELECT USING (true);
CREATE POLICY "Public read budget_items" ON budget_items FOR SELECT USING (true);
CREATE POLICY "Public read petty_cash_transactions" ON petty_cash_transactions FOR SELECT USING (true);
CREATE POLICY "Public read staff_allowances" ON staff_allowances FOR SELECT USING (true);
CREATE POLICY "Public read training_allocations" ON training_allocations FOR SELECT USING (true);

-- Public insert policies (admins enter records through the admin area)
CREATE POLICY "Public insert registrations" ON registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert transfers" ON transfers FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert weekly_budgets" ON weekly_budgets FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert budget_items" ON budget_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert petty_cash_transactions" ON petty_cash_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert staff_allowances" ON staff_allowances FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert training_allocations" ON training_allocations FOR INSERT WITH CHECK (true);