import type { Metadata } from 'next';
import { getSiteSettings } from '@/lib/data';
import { SettingsForm } from '@/components/admin/settings-form';

export const metadata: Metadata = { title: 'Site Settings' };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Site Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Contact details, social links and club information shown to fans on the public pages.
        </p>
      </section>

      <SettingsForm settings={settings} />
    </div>
  );
}