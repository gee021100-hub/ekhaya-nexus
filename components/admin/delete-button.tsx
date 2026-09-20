'use client';

import { useTransition } from 'react';

export function DeleteButton({
  action,
  id,
  label = 'Delete',
}: {
  action: (id: string) => Promise<unknown>;
  id: string;
  label?: string;
}) {
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm('Delete this item? This cannot be undone.')) {
          start(() => {
            void action(id);
          });
        }
      }}
      className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50 disabled:opacity-60"
    >
      {pending ? 'Deleting…' : label}
    </button>
  );
}