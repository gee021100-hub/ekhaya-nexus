import type { Metadata } from 'next';
import { getContactMessages } from '@/lib/data';
import { MessagesList } from '@/components/admin/messages-list';

export const metadata: Metadata = { title: 'Fan Messages' };

export default async function AdminMessagesPage() {
  const messages = await getContactMessages();
  const newCount = messages.filter((m) => m.status === 'new').length;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-xl font-bold text-slate-900">Fan Messages</h2>
        <p className="mt-1 text-sm text-slate-500">
          Messages sent by fans through the public Contact page.
          {newCount > 0 && (
            <span className="ml-2 rounded-full bg-club-gold-100 px-2.5 py-0.5 text-xs font-semibold text-club-gold-800">
              {newCount} new
            </span>
          )}
        </p>
      </section>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          No messages yet. When fans use the Contact page their messages arrive here.
        </div>
      ) : (
        <MessagesList messages={messages} />
      )}
    </div>
  );
}