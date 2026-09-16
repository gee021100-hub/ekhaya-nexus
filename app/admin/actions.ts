'use server';

import { revalidatePath } from 'next/cache';
import { createClient, supabaseConfigured } from '@/lib/supabase/server';

export interface ActionResult {
  success: boolean;
  message: string;
}

type InsertResult = { error: { message: string } | null };

async function persist(
  insert: () => Promise<InsertResult>,
  path: string,
  label: string,
): Promise<ActionResult> {
  if (!supabaseConfigured()) {
    return {
      success: false,
      message:
        'Database not connected. Add the Supabase environment variables to save records.',
    };
  }
  const { error } = await insert();
  if (error) {
    return { success: false, message: `Could not save ${label}. Please try again.` };
  }
  revalidatePath(path);
  return { success: true, message: `${label} saved successfully.` };
}

async function performInsert(table: string, values: Record<string, unknown>) {
  const supabase = await createClient();
  const { error } = await supabase.from(table).insert(values);
  return { error };
}

/* ------------------------------------------------------------------ */
/*  Player registration                                                */
/* ------------------------------------------------------------------ */

export async function createRegistration(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const registration = {
    team_id: String(formData.get('team_id') ?? ''),
    player_name: String(formData.get('player_name') ?? '').trim(),
    position: String(formData.get('position') ?? '').trim() || null,
    date_of_birth: String(formData.get('date_of_birth') ?? '') || null,
    registration_date:
      String(formData.get('registration_date') ?? '') || new Date().toISOString().slice(0, 10),
    fee_amount: formData.get('fee_amount') ? Number(formData.get('fee_amount')) || null : null,
    status: 'pending',
    notes: String(formData.get('notes') ?? '').trim() || null,
  };
  if (!registration.team_id || !registration.player_name) {
    return { success: false, message: 'Please provide the team and player name.' };
  }
  return persist(
    () => performInsert('registrations', registration),
    '/admin/players',
    'Registration',
  );
}

/* ------------------------------------------------------------------ */
/*  Transfers                                                          */
/* ------------------------------------------------------------------ */

export async function createTransfer(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const transfer = {
    team_id: String(formData.get('team_id') ?? ''),
    player_name: String(formData.get('player_name') ?? '').trim(),
    transfer_type: formData.get('transfer_type') === 'out' ? 'out' : ('in' as const),
    other_club: String(formData.get('other_club') ?? '').trim(),
    transfer_date: String(formData.get('transfer_date') ?? ''),
    fee_amount: formData.get('fee_amount') ? Number(formData.get('fee_amount')) || null : null,
    status: 'pending',
    notes: String(formData.get('notes') ?? '').trim() || null,
  };
  if (!transfer.team_id || !transfer.player_name || !transfer.other_club || !transfer.transfer_date) {
    return {
      success: false,
      message: 'Please provide the team, player name, other club and transfer date.',
    };
  }
  return persist(
    () => performInsert('transfers', transfer),
    '/admin/transfers',
    'Transfer',
  );
}

/* ------------------------------------------------------------------ */
/*  Weekly budget                                                      */
/* ------------------------------------------------------------------ */

export async function createWeeklyBudget(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const week_start = String(formData.get('week_start') ?? '');
  const week_end = String(formData.get('week_end') ?? '');
  if (!week_start || !week_end) {
    return { success: false, message: 'Please provide the budget week.' };
  }
  const budget = {
    week_start,
    week_end,
    status: 'draft' as const,
    notes: String(formData.get('notes') ?? '').trim() || null,
  };
  return persist(
    () => performInsert('weekly_budgets', budget),
    '/admin/budget',
    'Weekly budget',
  );
}

export async function createBudgetItem(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const budget_id = String(formData.get('budget_id') ?? '');
  const category = String(formData.get('category') ?? '').trim();
  if (!budget_id || !category) {
    return { success: false, message: 'Please provide the budget and a category.' };
  }
  const item = {
    budget_id,
    category,
    description: String(formData.get('description') ?? '').trim() || null,
    planned_amount: formData.get('planned_amount') ? Number(formData.get('planned_amount')) || 0 : 0,
    actual_amount: formData.get('actual_amount') ? Number(formData.get('actual_amount')) || null : null,
  };
  return persist(
    () => performInsert('budget_items', item),
    '/admin/budget',
    'Budget item',
  );
}

/* ------------------------------------------------------------------ */
/*  Petty cash                                                         */
/* ------------------------------------------------------------------ */

export async function createPettyCashTransaction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const amount = formData.get('amount') ? Number(formData.get('amount')) || 0 : 0;
  const description = String(formData.get('description') ?? '').trim();
  if (!description || amount <= 0) {
    return { success: false, message: 'Please provide a description and a positive amount.' };
  }
  const transaction = {
    transaction_date:
      String(formData.get('transaction_date') ?? '') || new Date().toISOString().slice(0, 10),
    transaction_type: formData.get('transaction_type') === 'out' ? 'out' : ('in' as const),
    description,
    amount,
    category: String(formData.get('category') ?? '').trim() || null,
    requestor: String(formData.get('requestor') ?? '').trim() || null,
    approved_by: String(formData.get('approved_by') ?? '').trim() || null,
    notes: String(formData.get('notes') ?? '').trim() || null,
  };
  return persist(
    () => performInsert('petty_cash_transactions', transaction),
    '/admin/petty-cash',
    'Petty cash entry',
  );
}

/* ------------------------------------------------------------------ */
/*  Staff allowances                                                   */
/* ------------------------------------------------------------------ */

export async function createStaffAllowance(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const allowance = {
    team_id: String(formData.get('team_id') ?? '') || null,
    staff_name: String(formData.get('staff_name') ?? '').trim(),
    role: String(formData.get('role') ?? '').trim() || null,
    period_start: String(formData.get('period_start') ?? ''),
    period_end: String(formData.get('period_end') ?? ''),
    amount: formData.get('amount') ? Number(formData.get('amount')) || 0 : 0,
    status: 'pending',
    notes: String(formData.get('notes') ?? '').trim() || null,
  };
  if (!allowance.staff_name || !allowance.period_start || !allowance.period_end) {
    return {
      success: false,
      message: 'Please provide the staff name and allowance period.',
    };
  }
  return persist(
    () => performInsert('staff_allowances', allowance),
    '/admin/staff',
    'Staff allowance',
  );
}

/* ------------------------------------------------------------------ */
/*  Training allocations                                               */
/* ------------------------------------------------------------------ */

export async function createTrainingAllocation(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const allocation = {
    team_id: String(formData.get('team_id') ?? ''),
    training_date: String(formData.get('training_date') ?? ''),
    location: String(formData.get('location') ?? '').trim() || null,
    session_type: String(formData.get('session_type') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim() || null,
    players_invited: formData.get('players_invited')
      ? Number(formData.get('players_invited')) || null
      : null,
    budget_amount: formData.get('budget_amount')
      ? Number(formData.get('budget_amount')) || null
      : null,
    status: 'scheduled',
  };
  if (!allocation.team_id || !allocation.training_date) {
    return { success: false, message: 'Please provide the team and training date.' };
  }
  return persist(
    () => performInsert('training_allocations', allocation),
    '/admin/training',
    'Training allocation',
  );
}