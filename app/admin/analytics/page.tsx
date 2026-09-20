import type { Metadata } from 'next';
import { getPageViewStats } from '@/lib/analytics';
import { getRecentAppEvents } from '@/lib/data';
import { supabaseConfigured } from '@/lib/supabase/server';
import { emailConfigured } from '@/lib/email';

export const metadata: Metadata = { title: 'Analytics & Monitoring' };

function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-black text-club-green-700">{value}</p>
      {hint && <p className="mt-0.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

export default async function AnalyticsPage() {
  const [stats, events] = await Promise.all([getPageViewStats(), getRecentAppEvents(20)]);

  const last14 = stats.days.slice(-14);
  const maxViews = Math.max(1, ...last14.map((d) => d.views));
  const totalDevices = Math.max(1, stats.devices.reduce((s, d) => s + d.views, 0));
  const maxPath = Math.max(1, ...stats.topPaths.map((p) => p.views));

  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  const sentryOn = Boolean(dsn);
  const emailOn = emailConfigured();

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">Visitor analytics</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="Visits · 30 days" value={stats.total30d} />
          <StatCard label="Visits · 7 days" value={stats.total7d} />
          <StatCard label="Unique visitors · 30 days" value={stats.uniques30d} />
        </div>
      </section>

      {stats.total30d === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
          No page views tracked yet. The tracker fires on every public page as soon as the{' '}
          <code className="rounded bg-slate-100 px-1">analytics_page_views</code> table exists —
          apply migration 000008 to turn it on.
        </section>
      ) : (
        <>
          <section>
            <h2 className="mb-4 text-xl font-bold text-slate-900">Visits · last 14 days</h2>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex h-40 items-end gap-2">
                {last14.map((day) => (
                  <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t bg-club-gold-500"
                        style={{ height: `${Math.max(4, (day.views / maxViews) * 100)}%` }}
                        title={`${day.date}: ${day.views}`}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {day.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-900">Most visited pages</h2>
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <ul className="divide-y divide-slate-100">
                  {stats.topPaths.map((p) => (
                    <li key={p.path} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                      <span className="truncate font-medium text-slate-900">{p.path}</span>
                      <span className="flex items-center gap-2">
                        <span className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                          <span
                            className="block h-full rounded-full bg-club-gold-500"
                            style={{ width: `${(p.views / maxPath) * 100}%` }}
                          />
                        </span>
                        <span className="w-10 text-right text-slate-500">{p.views}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-bold text-slate-900">Devices</h2>
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                {stats.devices.map((d) => (
                  <div key={d.device} className="mb-3">
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium capitalize text-slate-900">{d.device}</span>
                      <span className="text-slate-500">
                        {d.views}
                        <span className="ml-1 text-xs text-slate-400">
                          ({Math.round((d.views / totalDevices) * 100)}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-club-gold-500"
                        style={{ width: `${(d.views / totalDevices) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </>
      )}

      <section>
        <h2 className="mb-4 text-xl font-bold text-slate-900">Recent system events</h2>
        {events.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
            No diagnostic events yet. Server errors are logged here once the{' '}
            <code className="rounded bg-slate-100 px-1">app_events</code> table is applied
            (migration 000008).
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <ul className="divide-y divide-slate-100">
              {events.map((event) => (
                <li key={event.id} className="flex items-start gap-3 px-4 py-3 text-sm">
                  <span
                    className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      event.level === 'error'
                        ? 'bg-red-100 text-red-700'
                        : event.level === 'warn'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {event.level}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-slate-900">
                      {event.message} <span className="text-slate-400">· {event.scope}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {new Date(event.created_at).toLocaleString()} {event.path ? `· ${event.path}` : ''}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section
        className={`rounded-2xl border p-4 text-sm ${
          sentryOn
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-amber-200 bg-amber-50 text-amber-800'
        }`}
      >
        {sentryOn
          ? 'Sentry error tracking is live — server and client exceptions are forwarded to '
          : 'Sentry error tracking is not configured. Set SENTRY_DSN (and NEXT_PUBLIC_SENTRY_DSN) to get '
        }
        crash and error alerts alongside {emailOn ? 'Resend transactional email.' : 'email (set RESEND_API_KEY for transactional email).'}
      </section>

      <p className="text-xs text-slate-400">
        Database {supabaseConfigured() ? 'connected' : 'not configured'} · Analytics keeps no IPs and no
        user-identifiable data — just an anonymised visitor hash, page paths and device class.
      </p>
    </div>
  );
}