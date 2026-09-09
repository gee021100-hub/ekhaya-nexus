import { createAdminClient, adminConfigured } from '@/lib/supabase/admin';

export const TEMPLATE_CODES = {
  welcome: 'welcome',
  paymentReceived: 'payment_received',
  membershipActivated: 'membership_activated',
  paymentRejected: 'payment_rejected',
  renewalDue: 'renewal_due',
  renewalOverdue: 'renewal_overdue',
  qrVerified: 'qr_verified',
  supportReply: 'support_reply',
} as const;

export type TemplateCode = (typeof TEMPLATE_CODES)[keyof typeof TEMPLATE_CODES];

export type NotificationType = TemplateCode | string;

export type NotificationChannel = 'email' | 'sms' | 'inapp';

export interface NotificationPayload {
  profileId: string;
  channel: NotificationChannel;
  type: NotificationType;
  templateCode: string;
  subject?: string;
  body: string;
}

/** Inserts a notification row onto the queue (channel, template, body). */
export async function enqueueNotification(payload: NotificationPayload): Promise<boolean> {
  if (!adminConfigured()) return false;
  const supabase = createAdminClient();
  const { error } = await supabase.from('notifications').insert({
    profile_id: payload.profileId,
    channel: payload.channel,
    type: payload.type,
    template_code: payload.templateCode,
    subject: payload.subject ?? null,
    body: payload.body,
    payload: {},
  });
  if (error) return false;
  return true;
}

/** Compiled template: DB row takes priority, code fallback keeps tests working. */
export async function getTemplate(
  code: TemplateCode | string,
): Promise<{ subject?: string; body?: { em?: (v: unknown) => string } }> {
  if (!adminConfigured()) return {};
  const supabase = createAdminClient();
  const { data } = await supabase
    .from('notification_templates')
    .select('subject, body')
    .eq('code', code)
    .maybeSingle();
  if (!data) return {};
  return { subject: data.subject ?? undefined, body: data.body ?? undefined };
}