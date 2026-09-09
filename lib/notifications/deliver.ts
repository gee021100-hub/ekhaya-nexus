import type { SupabaseClient } from '@supabase/supabase-js';
import { enqueueNotification, type NotificationPayload } from '@/lib/notifications/index';
import { sendEmail, sendSms } from '@/lib/notifications/providers';

export async function notifyEssential(
  supabase: SupabaseClient,
  payload: NotificationPayload,
): Promise<boolean> {
  try {
    if (payload.channel === 'email') {
      const ok = await sendEmail(supabase, payload.profileId, {
        to: '',
        subject: payload.subject ?? 'Ekhaya FC',
        text: payload.body,
      });
      if (ok) {
        await enqueueNotification(payload);
      }
      return ok;
    }
    if (payload.channel === 'sms') {
      const ok = await sendSms(supabase, payload.profileId, payload.body);
      if (ok) {
        await enqueueNotification(payload);
      }
      return ok;
    }
    return await enqueueNotification(payload);
  } catch {
    return false;
  }
}