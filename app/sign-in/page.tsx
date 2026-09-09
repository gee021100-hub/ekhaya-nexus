import Link from 'next/link';
import { SignInForm } from '@/components/forms/signin-form';

export default function SignInPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to your Ekhaya FC membership.</p>
        <div className="mt-6">
          <SignInForm />
        </div>
        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{' '}
          <Link href="/join" className="font-semibold text-club-gold-700 hover:text-club-gold-800">
            Join the club
          </Link>
        </p>
      </div>
    </div>
  );
}