'use client';

import { useActionState } from 'react';
import { createMediaItem, type ActionResult } from '@/app/admin/actions';
import { Field, TextInput, SelectInput, SubmitButton } from '@/components/admin/form';

export function MediaForm() {
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(
    createMediaItem,
    null,
  );

  return (
    <form action={action} className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-base font-bold text-slate-900">Add media item</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title *">
          <TextInput name="title" placeholder="e.g. Match highlights vs Big Bullets" required />
        </Field>
        <Field label="Media type">
          <SelectInput name="media_type" defaultValue="highlight">
            <option value="video">Video</option>
            <option value="photo">Photo</option>
            <option value="highlight">Match highlight</option>
          </SelectInput>
        </Field>
        <Field label="Upload file (photos &amp; highlights)" className="sm:col-span-2">
          <input
            type="file"
            name="file"
            accept="image/*,video/*"
            className="w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-club-green-700 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          <span className="mt-1 block text-xs text-slate-400">
            Uploaded files are stored in the Supabase `ekhaya-media` bucket. For videos,
            paste an embed URL below instead.
          </span>
        </Field>
        <Field label="Media URL" className="sm:col-span-2">
          <TextInput
            name="url"
            type="url"
            placeholder="https://youtube.com/embed/… or image URL"
          />
        </Field>
        <Field label="Thumbnail URL" className="sm:col-span-2">
          <TextInput name="thumbnail_url" type="url" placeholder="Optional thumbnail image" />
        </Field>
        <Field label="Published at">
          <TextInput name="published_at" type="datetime-local" />
        </Field>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton pending={pending} label="Add media" />
        {state && (
          <p className={`text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}