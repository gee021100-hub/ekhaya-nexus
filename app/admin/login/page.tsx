import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = { title: 'Admin Sign In' };

export default function AdminLoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center gap-6 px-4 py-12">
      <div className="text-center">
        <h2 className="text-2xl font-black text-slate-900">Administration sign in</h2>
        <p className="mt-1 text-sm text-slate-500">
          Sign in with your staff account to manage the Ekhaya platform.
        </p>
      </div>
      <LoginForm />
    </div>
  );
}