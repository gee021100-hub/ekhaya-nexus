# Agent instructions

Work-here conventions for the Ekhaya App platform.

## Commands

- Install: `pnpm install`
- Dev: `pnpm dev`
- Build: `pnpm build`
- Lint: `pnpm lint`
- Typecheck: `pnpm typecheck`
- Start: `pnpm start`
- Supabase migrations: `pnpm db:start`, `pnpm db:migrate`, `pnpm db:seed`

Always run `pnpm typecheck` and `pnpm lint` after changing code.

## Conventions

- Next.js 15 App Router. Pages under `app/`. Domain/data access in
  `lib/data.ts`. Shared UI components in `components/`.
- `@/*` maps to the repo root.
- Domain types and team config live in `types/index.ts`.
- Four teams only: Senior, Women's, Reserve, Youth. Data is strictly separated
  per team — do not copy records between teams.
- Performance exists **only** for the Senior Team. It supports competition
  selection limited exactly to: FDH Championship, Airtel Cup, Castel Cup.
- Player profiles contain Name, Squad number, Strong foot, Age, Position, Goals,
  Assists — only populate fields for which data has been provided. Missing data
  stays empty (do not convert to fake zeros that aren't in the data). The Senior
  Team squad is the full 32-player roster with jersey numbers and positions in
  `lib/data.ts` (`SEED_PLAYERS`) and the SQL seed.
- Administration area under `app/admin/` provides six modules: player
  registration, transfers, weekly budget preparation (weekly_budgets +
  budget_items), petty cash, staff allowances and training allocations.
  Admin tables start empty (no invented financial/operational data); records
  are entered by staff via the admin forms, which persist through the server
  actions in `app/admin/actions.ts` (Supabase inserts).
- `/admin` is protected by `middleware.ts` via Supabase Auth. Staff sign in at
  `/admin/login` (`signInAdmin` in `app/admin/actions.ts`) and sign out through
  the admin header. When Supabase env vars are absent the middleware stands
  aside so the admin area works in-memory. Admin tables (migration `000001`)
  have authenticated read + insert RLS policies; core tables have public
  SELECT only (no anonymous writes). Migration `000003_auth_storage.sql`
  wires Auth + the `ekhaya-media` Storage bucket and hardens these policies.
- Digital fan modules: news (`/news`, `/admin/news`), media (`/media`,
  `/admin/media`), tickets (`/tickets`, `/admin/tickets`), membership
  (`/membership`), the Live Match Centre (`/match-centre`), the official store
  (`/store`, `/store/checkout`, `/admin/store`), fan engagement polls
  (`/polls`, `/admin/polls`) and the notification tray (bell in the header,
  `/admin/notifications`). News, media, ticket allocations, store products,
  polls and notifications start empty and are entered by staff via the admin
  forms (public read + authenticated insert). Fans self-serve ticket bookings,
  membership signups, store checkout and poll votes through the public forms in
  `app/actions.ts` (Supabase inserts). Ticket bookings run through the
  `book_tickets` database function (migration `000005_book_tickets_rpc.sql`)
  which validates availability, uses the stored allocation price and updates
  the sold count atomically. Store checkouts recompute every price server-side
  from `store_products` and create a pending payment like bookings; polls are
  one vote per device, enforced by the unique `(poll_id, visitor)` key in
  `poll_votes` (migration `000009_digital_fan.sql`) with results served by the
  `get_poll_results` RPC and votes cast through `cast_poll_vote`. The cart is a
  client context (`components/store/cart-context.tsx`, mounted in the root
  layout and persisted to localStorage) with a drawer
  (`components/store/cart-drawer.tsx`); the notifications tray
  (`components/notifications/notifications-provider.tsx`) polls
  `/api/notifications` and marks reads in localStorage. Membership tiers and
  ticket stand categories are configured in `types/index.ts`.
- Online payments (migration `000007_payments.sql`): paid ticket bookings,
  paid memberships and store orders create a pending `payment_transactions`
  row through the `create_payment` database function — the amount is always
  computed server-side (stored stand price × quantity, the tier `priceValue`,
  or the stored product prices), never from the form. Fans complete payment in
  `components/payment-form.tsx` (shown after booking/signup/checkout).
  `PAYMENT_MODE` (`lib/payments.ts`) selects `sandbox` (auto-confirm, demo
  only) or `manual` (staff verify). Sandbox calls `confirm_payment`;
  manual calls `record_payment_reference` and stations the transaction pending
  for staff. Admin reconciliation lives at `/admin/payments`
  (`confirmPayment`/`cancelPayment` in `app/admin/actions.ts`), flips the linked
  booking to `payment_status='paid'` / membership to `active` / store order to
  `paid` via `confirm_payment`, and powers payment figures on the dashboard and
  reports.
  Wallet numbers fans pay into are editable in Site Settings
  (`payment_to_mpamba`, `payment_to_airtel`, `payment_instructions`). A real
  mobile-money/online gateway can be added behind the same RPCs without
  changing the fan or admin flow. Fans who pay are self-served under the
  public-insert trust model (like bookings/memberships); in `manual` mode staff
  must verify each wallet reference before confirming.
- Club content (migration `000006_content.sql`): announcements (`/admin/announcements`,
  shown on the home page), sponsors (`/admin/sponsors`, shown on home + `/about`),
  site settings (`/admin/settings`, contact details/socials/stadium/about text used
  by `/contact`, `/about`, the footer and the home page) and fan messages
  (`/admin/messages`, collected from the `/contact` form). Content tables are
  public-read only; writes require an **authenticated** admin session.
  `contact_messages` allows anonymous inserts (fans) but only authenticated
  reads (admin). Settings win over any hardcoded fallback when connected.
  `SITE_SETTING_FIELDS` in `types/index.ts` drives the settings form.
- Media uploads: the `/admin/media` form accepts a photo/highlight file which
  is uploaded to the public `ekhaya-media` Storage bucket; video items use an
  external embed URL.
- The app is a PWA: `app/manifest.ts`, icons from `scripts/generate-icons.mjs`
  (`pnpm icons`, keeps `public/icons/`, `app/icon.png`, `app/apple-icon.png`)
  and `public/sw.js` registered only in production-on-HTTPS
  (`components/pwa-register.tsx`). Re-run `pnpm icons` if the crest changes.
- Dev/start scripts bind `0.0.0.0:3100` so the app works on all devices on the
  same network (`pnpm dev`/`pnpm start`). Remote dev origins are allowed in
  `allowedDevOrigins` inside `next.config.mjs`.
- The Live Match Centre is read-only and must be derived strictly from the
  supplied fixtures, results, performance, standings and player data — never
  invent live scores, events or line-ups.
- Management reports live at `/admin/reports` and aggregate existing data
  across football, administration and the digital modules.
- Database schema lives in `supabase/migrations/`; seed in
  `supabase/seed/seed.sql`.
- When Supabase env vars (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are absent, `lib/data.ts` falls back to the
  in-memory seed so the app runs without a database. Keep the fallback in sync
  with the SQL seed. Admin reads fall back to empty arrays when no database is
  configured.
- No invented football data, players, match results, fixtures or statistics.
- The UI is responsive on desktop, tablet and mobile.
- Brand is **white and gold.** The legacy `club-green-*` theme tokens are
  aliased to the gold palette in `app/globals.css` — do not reintroduce green
  as a brand colour. Page headers use the `PageHero` component
  (`components/brand/hero.tsx`), which renders the Ekhaya crest
  (`public/branding/ekhaya-logo.jpg`) as a full-bleed background cover. The
  crest image is also used in `components/brand/logo.tsx` (navigation).
- Opponent club crests live under `public/teams/`. Keep the name→path mapping
  in `lib/logos.ts` in sync with any new club name, and render crests with
  `components/brand/team-logo.tsx` (`TeamLogo`) anywhere a club name is shown
  (standings, results, fixtures, match centre).

## Security & operations

- **Security headers** are emitted by `next.config.mjs` (`headers()`):
  `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
  `Permissions-Policy`, `Strict-Transport-Security`, and a **production-only
  CSP**. The CSP keeps `script-src`/`style-src` at `'unsafe-inline'` because
  the App Router embeds the RSC payload in inline scripts; do not tighten it
  to nonce/hash policies until the edge proxy supplies per-request nonces.
  `poweredByHeader: false` also set.
- **Fan forms are rate-limited** in-memory (`lib/rate-limit.ts`, keyed by
  client IP): `booking` 6/min, `membership` 4/min, `contact` 5/min,
  `track` 30/min. The store is instance-local — move to a shared store if the
  app is ever scaled to multiple instances. The contact form also has a
  hidden **honeypot** field.
- **Server diagnostics** write to `app_events` (migration `000008`):
  `lib/telemetry.ts` (`logEvent`/`logError`) runs on the server only via the
  service-role client (`lib/supabase/admin.ts`) — never import it into client
  components. Staff read events on the admin dashboard and `/admin/analytics`
  (RLS authenticated SELECT; there is no anon/authenticated INSERT policy).
- **Privacy-friendly page analytics**: `components/page-view-tracker.tsx`
  (mounted in the root layout) sends a visit to `/api/track`, which stores a
  hash of an anonymised visitor id + path/device/locale/viewport in
  `analytics_page_views`. No IPs are stored. Reads are staff-only
  (`/admin/analytics`, via `lib/analytics.ts`).
- **Health probes** for uptime monitoring: `/healthz` (liveness) and
  `/healthz/db` (503 when Supabase is unreachable). `/robots.txt` disallows
  `/admin`, `/api/`, `/healthz`; `/.well-known/security.txt` is RFC 9116.
- **Email** is best-effort via `lib/email.ts` (Resend REST API): without
  `RESEND_API_KEY` it silently no-ops; with it, tickets/membership/contact
  confirmations are sent. Never fail a fan action because an email didn't send.
- **Sentry** (`@sentry/nextjs`) is wired through `withSentryConfig` in
  `next.config.mjs` — but only activated when a DSN env is present, so builds
  work without it. Config: `sentry.server.config.ts`, `sentry.edge.config.ts`,
  `sentry.client.config.ts`, `instrumentation.ts`. Error forwarding is also
  branched from `lib/telemetry.ts`.
- **Supabase migrations are applied from this machine via the Management API**
  (access token cached at `~/.supabase/access-token`): POST the SQL to
  `https://api.supabase.com/v1/projects/{ref}/database/query` with
  `Authorization: Bearer <sbp_...>`, then record the version in
  `supabase_migrations.schema_migrations` (version + name + statements array) so
  `supabase migration list --linked` stays in sync. Table DDL/RPCs can also be
  run in the Dashboard → SQL Editor. New features must degrade gracefully when a
  table doesn't exist yet.
- **Go-live / hosting state**: the app is in `PAYMENT_MODE=manual` (staff
  verify wallet references at `/admin/payments` — never leave it in sandbox for
  production). Starter club content is seeded by migration `000010_starter_content.sql`
  (news, announcements, sponsors, site settings, store products, polls,
  notifications); the in-memory `SEED_*` fallbacks in `lib/data.ts` stay empty
  for these digital modules so real content is only ever authored in the
  database/admin forms. The only seeded accounts are Supabase Auth users
  (e.g. `admin@ekhaya-fc.mw`, role `admin`) provisioned via the GoTrue
  Admin API; never seed staff passwords in SQL. Production runs as **user
  systemd units**: `ekhaya-app` (`~/.config/systemd/user/ekhaya-app.service`,
  `ExecStart=pnpm start`, EnvironmentFile `.env.local`) and `ekhaya-tunnel`
  (cloudflared quick tunnel → `http://localhost:3100`). `loginctl
  enable-linger thiago` is on. The current public URL (ephemeral, changes on
  tunnel restart) is stashed at `/tmp/opencode/current-url`. There is no stable
  domain yet — a free stable hostname needs an account (ngrok / Cloudflare /
  localhost.run admin); point a real domain at the tunnel later. Restarting
  `ekhaya-app` resets the in-memory rate-limit buckets.
- **Two public tunnels run as user systemd units**: `ekhaya-tunnel` (cloudflared
  quick tunnel, main) and `ekhaya-tunnel-lhr` (localhost.run `ssh -R
  80:localhost:3100 nokey@localhost.run`, fallback — useful when trycloudflare is
  unreachable from a visitor's network). The lhr hostname is random and printed
  with `-tt`; recover it with `journalctl --user -u ekhaya-tunnel-lhr | grep -aoE
  "[a-z0-9]{14}\.lhr\.life"`. Current lhr URL is stashed at
  `/tmp/opencode/current-url-lhr`. On same-Wi-Fi devices the app also answers
  directly at `http://<lan-ip>:3100`.
- **Middleware auth is cached** (`middleware.ts`): verified staff sessions are
  remembered in a 60s per-process cache so the admin layout's route-prefetch
  burst (~25 concurrent `/admin/*` requests) doesn't hammer GoTrue. When
  changing the middleware or auth flow, keep this cache and the sign-in
  behaviour in mind: `signInAdmin` no longer `redirect()`s from the server
  action (Next can silently drop the action redirect under prefetch load); the
  login form hard-navigates (`window.location.href = '/admin'`) on success.
  Admin pages must never pass functions as props to client components
  (`/admin/payments` previously crashed with "Functions cannot be passed
  directly to Client Components") — precompute display strings server-side.
