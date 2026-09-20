'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient, supabaseConfigured } from '@/lib/supabase/server';
import { SITE_SETTING_FIELDS } from '@/types';

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

/* ------------------------------------------------------------------ */
/*  News & announcements                                               */
/* ------------------------------------------------------------------ */

export async function createNewsArticle(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const title = String(formData.get('title') ?? '').trim();
  const content = String(formData.get('content') ?? '').trim();
  if (!title || !content) {
    return { success: false, message: 'Please provide a news title and content.' };
  }
  const article = {
    title,
    summary: String(formData.get('summary') ?? '').trim() || null,
    content,
    category: String(formData.get('category') ?? '').trim() || 'News',
    published_at:
      String(formData.get('published_at') ?? '') ||
      new Date().toISOString(),
  };
  return persist(
    () => performInsert('news_articles', article),
    '/admin/news',
    'News article',
  );
}

/* ------------------------------------------------------------------ */
/*  Match media & highlights                                           */
/* ------------------------------------------------------------------ */

export async function createMediaItem(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const title = String(formData.get('title') ?? '').trim();
  const url = String(formData.get('url') ?? '').trim();
  const media_type = formData.get('media_type');
  if (!title) {
    return { success: false, message: 'Please provide a media title.' };
  }

  let finalUrl = url;

  const file = formData.get('file');
  if (file instanceof File && file.size > 0) {
    if (!supabaseConfigured()) {
      return {
        success: false,
        message:
          'Database not connected. Add the Supabase environment variables to upload media files.',
      };
    }
    const supabase = await createClient();
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `media/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from('ekhaya-media')
      .upload(path, file, { upsert: false, contentType: file.type });
    if (uploadError) {
      return { success: false, message: 'Could not upload the media file. Please try again.' };
    }
    finalUrl = supabase.storage.from('ekhaya-media').getPublicUrl(path).data.publicUrl;
  }

  if (!finalUrl) {
    return { success: false, message: 'Please provide a media URL or upload a file.' };
  }

  const item = {
    title,
    media_type: media_type === 'photo' || media_type === 'highlight' ? media_type : ('video' as const),
    url: finalUrl,
    thumbnail_url: String(formData.get('thumbnail_url') ?? '').trim() || null,
    published_at:
      String(formData.get('published_at') ?? '') ||
      new Date().toISOString(),
  };
  return persist(
    () => performInsert('media_items', item),
    '/admin/media',
    'Media item',
  );
}

/* ------------------------------------------------------------------ */
/*  Authentication (Supabase Auth)                                     */
/* ------------------------------------------------------------------ */

export async function signInAdmin(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  if (!supabaseConfigured()) {
    return {
      success: false,
      message:
        'Database not connected. Add the Supabase environment variables to enable staff sign-in.',
    };
  }
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  if (!email || !password) {
    return { success: false, message: 'Please provide your email and password.' };
  }
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, message: 'Invalid email or password.' };
  }
  // The sign-in form navigates client-side once the session cookie is set;
  // navigate via window.location so the auth middleware always gets the
  // full request (redirect() inside the action can drop under prefetch load).
  return { success: true, message: 'Signed in. Opening the dashboard…' };
}

export async function signOutAdmin(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/admin/login');
  redirect('/admin/login');
}

/* ------------------------------------------------------------------ */
/*  Ticket allocations                                                 */
/* ------------------------------------------------------------------ */

export async function createTicketAllocation(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const fixture_id = String(formData.get('fixture_id') ?? '') || null;
  const category = String(formData.get('category') ?? '').trim();
  if (!fixture_id || !category) {
    return {
      success: false,
      message: 'Please provide the fixture and a ticket category.',
    };
  }
  const allocation = {
    fixture_id,
    category,
    price: formData.get('price') ? Number(formData.get('price')) || 0 : 0,
    capacity: formData.get('capacity') ? Number(formData.get('capacity')) || 0 : 0,
    sold: 0,
    status: 'available',
  };
  return persist(
    () => performInsert('ticket_allocations', allocation),
    '/admin/tickets',
    'Ticket allocation',
  );
}

/* ------------------------------------------------------------------ */
/*  Announcements                                                      */
/* ------------------------------------------------------------------ */

export async function createAnnouncement(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const title = String(formData.get('title') ?? '').trim();
  if (!title) {
    return { success: false, message: 'Please provide an announcement title.' };
  }
  const announcement = {
    title,
    body: String(formData.get('body') ?? '').trim() || null,
    type: String(formData.get('type') ?? '').trim() || 'Announcement',
    is_pinned: formData.get('is_pinned') === 'on',
    published_at:
      String(formData.get('published_at') ?? '') || new Date().toISOString(),
  };
  return persist(
    () => performInsert('announcements', announcement),
    '/admin/announcements',
    'Announcement',
  );
}

export async function deleteAnnouncement(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: 'Invalid announcement.' };
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.from('announcements').delete().eq('id', id);
    },
    '/admin/announcements',
    'Announcement deleted.',
    ['/', '/about'],
  );
}

/* ------------------------------------------------------------------ */
/*  Sponsors & partners                                                */
/* ------------------------------------------------------------------ */

export async function createSponsor(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) {
    return { success: false, message: 'Please provide the sponsor name.' };
  }
  const sponsor = {
    name,
    level: String(formData.get('level') ?? '').trim() || 'Official Partner',
    website: String(formData.get('website') ?? '').trim() || null,
    logo_url: String(formData.get('logo_url') ?? '').trim() || null,
    description: String(formData.get('description') ?? '').trim() || null,
    sort_order: formData.get('sort_order') ? Number(formData.get('sort_order')) || 0 : 0,
    enabled: true,
  };
  return persist(
    () => performInsert('sponsors', sponsor),
    '/admin/sponsors',
    'Sponsor',
  );
}

export async function deleteSponsor(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: 'Invalid sponsor.' };
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.from('sponsors').delete().eq('id', id);
    },
    '/admin/sponsors',
    'Sponsor deleted.',
    ['/', '/about'],
  );
}

/* ------------------------------------------------------------------ */
/*  Site settings                                                      */
/* ------------------------------------------------------------------ */

export async function saveSiteSettings(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const toUpsert: { key: string; value: string }[] = [];
  const toDelete: string[] = [];

  for (const field of SITE_SETTING_FIELDS) {
    const value = String(formData.get(field.key) ?? '').trim();
    if (value) {
      toUpsert.push({ key: field.key, value });
    } else {
      toDelete.push(field.key);
    }
  }

  return mutate(
    async () => {
      const supabase = await createClient();
      if (toUpsert.length > 0) {
        const { error } = await supabase.from('site_settings').upsert(toUpsert, {
          onConflict: 'key',
        });
        if (error) return { error };
      }
      if (toDelete.length > 0) {
        const { error } = await supabase
          .from('site_settings')
          .delete()
          .in('key', toDelete);
        if (error) return { error };
      }
      return { error: null };
    },
    '/admin/settings',
    'Site settings saved.',
    ['/', '/about', '/contact'],
  );
}

/* ------------------------------------------------------------------ */
/*  Payments (staff reconciliation)                                    */
/* ------------------------------------------------------------------ */

export async function confirmPayment(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const transactionId = String(formData.get('transaction_id') ?? '').trim();
  if (!transactionId) {
    return { success: false, message: 'Invalid payment record.' };
  }
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.rpc('confirm_payment', {
        p_transaction_id: transactionId,
        p_provider_reference: '',
        p_provider: null,
      });
    },
    '/admin/payments',
    'Payment confirmed — the booking/membership has been updated.',
    ['/tickets', '/membership', '/admin/reports'],
  );
}

export async function cancelPayment(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const transactionId = String(formData.get('transaction_id') ?? '').trim();
  if (!transactionId) {
    return { success: false, message: 'Invalid payment record.' };
  }
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.rpc('cancel_payment', { p_transaction_id: transactionId });
    },
    '/admin/payments',
    'Payment marked as failed — no funds recorded.',
    ['/tickets', '/membership'],
  );
}

/* ------------------------------------------------------------------ */
/*  Official store products                                            */
/* ------------------------------------------------------------------ */

export async function createStoreProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) {
    return { success: false, message: 'Please provide a product name.' };
  }
  const category = String(formData.get('category') ?? '').trim();
  const product = {
    name,
    category: category || 'Kits',
    price: formData.get('price') ? Number(formData.get('price')) || 0 : 0,
    original_price: formData.get('original_price')
      ? Number(formData.get('original_price')) || null
      : null,
    description: String(formData.get('description') ?? '').trim() || null,
    image_url: String(formData.get('image_url') ?? '').trim() || null,
    sizes: String(formData.get('sizes') ?? '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    customizable: formData.get('customizable') === 'on',
    in_stock: formData.get('in_stock') !== 'off',
    badge: String(formData.get('badge') ?? '').trim() || null,
    sort_order: formData.get('sort_order') ? Number(formData.get('sort_order')) || 0 : 0,
    enabled: formData.get('enabled') !== 'off',
  };
  return persist(
    () => performInsert('store_products', product),
    '/admin/store',
    'Store product',
  );
}

export async function deleteStoreProduct(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: 'Invalid product.' };
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.from('store_products').delete().eq('id', id);
    },
    '/admin/store',
    'Store product deleted.',
    ['/store'],
  );
}

export async function toggleStoreProduct(id: string, enabled: boolean): Promise<ActionResult> {
  if (!id) return { success: false, message: 'Invalid product.' };
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.from('store_products').update({ enabled }).eq('id', id);
    },
    '/admin/store',
    enabled ? 'Product shown in the store.' : 'Product hidden from the store.',
    ['/store'],
  );
}

/* ------------------------------------------------------------------ */
/*  Fan engagement polls                                               */
/* ------------------------------------------------------------------ */

export async function createFanPoll(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const question = String(formData.get('question') ?? '').trim();
  const optionsRaw = String(formData.get('options') ?? '').trim();
  if (!question) {
    return { success: false, message: 'Please provide a poll question.' };
  }
  const options = optionsRaw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((text, i) => ({ id: `opt-${i + 1}`, text }));
  if (options.length < 2) {
    return { success: false, message: 'Please provide at least two answer options, one per line.' };
  }
  const poll = {
    question,
    category: String(formData.get('category') ?? '').trim() || 'Match Prediction',
    description: String(formData.get('description') ?? '').trim() || null,
    options,
    featured_match: String(formData.get('featured_match') ?? '').trim() || null,
    active: formData.get('active') === 'on',
    ends_at: String(formData.get('ends_at') ?? '') || null,
  };
  return persist(
    () => performInsert('fan_polls', poll),
    '/admin/polls',
    'Fan poll',
  );
}

export async function deleteFanPoll(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: 'Invalid poll.' };
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.from('fan_polls').delete().eq('id', id);
    },
    '/admin/polls',
    'Poll deleted.',
    ['/polls'],
  );
}

export async function toggleFanPoll(id: string, active: boolean): Promise<ActionResult> {
  if (!id) return { success: false, message: 'Invalid poll.' };
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.from('fan_polls').update({ active }).eq('id', id);
    },
    '/admin/polls',
    active ? 'Poll opened for votes.' : 'Poll closed for votes.',
    ['/polls'],
  );
}

/* ------------------------------------------------------------------ */
/*  Fan notifications (broadcast tray)                                 */
/* ------------------------------------------------------------------ */

export async function createFanNotification(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const title = String(formData.get('title') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  if (!title || !message) {
    return { success: false, message: 'Please provide a notification title and message.' };
  }
  const notification = {
    title,
    message,
    category: String(formData.get('category') ?? '').trim() || 'news',
    published_at: new Date().toISOString(),
    enabled: formData.get('enabled') !== 'off',
  };
  return persist(
    () => performInsert('fan_notifications', notification),
    '/admin/notifications',
    'Notification',
  );
}

export async function deleteFanNotification(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: 'Invalid notification.' };
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.from('fan_notifications').delete().eq('id', id);
    },
    '/admin/notifications',
    'Notification deleted.',
    ['/admin/notifications'],
  );
}

/* ------------------------------------------------------------------ */
/*  Store orders (staff follow-up)                                     */
/* ------------------------------------------------------------------ */

export async function cancelStoreOrder(id: string): Promise<ActionResult> {
  if (!id) return { success: false, message: 'Invalid order.' };
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.from('store_orders').update({ payment_status: 'cancelled' }).eq('id', id);
    },
    '/admin/store',
    'Order marked as cancelled.',
    ['/store'],
  );
}

/* ------------------------------------------------------------------ */
/*  Contact messages                                                   */
/* ------------------------------------------------------------------ */

export async function markContactMessage(
  id: string,
  status: 'new' | 'read' | 'archived',
): Promise<ActionResult> {
  if (!id) return { success: false, message: 'Invalid message.' };
  return mutate(
    async () => {
      const supabase = await createClient();
      return supabase.from('contact_messages').update({ status }).eq('id', id);
    },
    '/admin/messages',
    'Message updated.',
    ['/admin/messages'],
  );
}

/* ------------------------------------------------------------------ */
/*  Generic mutation helper (insert/update/delete with fallback guard) */
/* ------------------------------------------------------------------ */

async function mutate(
  run: () => Promise<{ error: { message: string } | null }>,
  path: string,
  successMessage: string,
  extraPaths: string[] = [],
): Promise<ActionResult> {
  if (!supabaseConfigured()) {
    return {
      success: false,
      message:
        'Database not connected. Add the Supabase environment variables to save changes.',
    };
  }
  const { error } = await run();
  if (error) {
    return { success: false, message: 'Could not save the change. Please try again.' };
  }
  revalidatePath(path);
  for (const extra of extraPaths) revalidatePath(extra);
  return { success: true, message: successMessage };
}