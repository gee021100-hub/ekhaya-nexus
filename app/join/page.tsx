import { redirect } from 'next/navigation';
import { getSessionUser } from '@/lib/auth/session';

export default async function JoinPage() {
  const user = await getSessionUser();
  if (user) redirect('/member/dashboard');
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-4">
        Join Ekhaya FC
      </h1>
      <p className="text-sm text-slate-500 mb-8">
        Become an official member and unlock your member number, digital card and club benefits.
      </p>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
        <p className="text-sm text-slate-600">
          Create your account below to start your membership journey.
        </p>
        <SignUpForm />
      </div>
    </div>
  );
}