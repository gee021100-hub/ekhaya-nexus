import type { Metadata } from 'next';
import { getFanNotifications } from '@/lib/data';
import { NotificationForm } from '@/components/admin/notification-form';
import { NotificationManager } from '@/components/admin/notification-manager';

export const metadata: Metadata = { title: 'Notifications' };

export default async function AdminNotificationsPage() {
  const notifications = await getFanNotifications();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Notifications</h2>
        <p className="mt-1 text-sm text-slate-500">
          Broadcast match-day, news, ticket and store updates to fans through the bell tray
          on every page of the app.
        </p>
      </section>

      <NotificationForm />
      <NotificationManager notifications={notifications} />
    </div>
  );
}