import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const inputClass =
  'w-full rounded-lg border border-club-border bg-white px-3 py-2 text-sm text-[#161616] placeholder-slate-400 transition-shadow focus:border-club-gold-500 focus:outline-none focus:ring-2 focus:ring-club-gold-200';

export function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputClass, props.className)} />;
}

export function SelectInput(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(inputClass, props.className)} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(inputClass, 'min-h-16', props.className)} />;
}

export function SubmitButton({
  pending,
  label,
  pendingLabel = 'Saving…',
}: {
  pending: boolean;
  label: string;
  pendingLabel?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-lg bg-club-gold px-4 py-2 text-sm font-semibold text-club-ink shadow-sm transition-all hover:bg-club-gold-400 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}