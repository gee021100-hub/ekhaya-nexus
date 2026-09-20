# EKHAYA APP

Football team management, statistics and digital fan platform for **Ekhaya FC**.

## Purpose

Manage exactly four teams — Senior, Women's, Reserve and Youth — with players,
profiles, results, fixtures, standings, and (Senior Team only) performance
statistics broken down by competition. On top of that, the club digital
platform provides a live match centre, news & media, match tickets and fan
membership.

The application is structured so it can later be reused as the foundation for a
mobile application.

## Stack

- **Next.js 15 (App Router) + TypeScript** — server-rendered, responsive web app
- **Supabase** — PostgreSQL relational database
- **Tailwind CSS v4** — responsive design (desktop / tablet / mobile)

## Teams & sections

| Team         | Sections                                                  |
|--------------|-----------------------------------------------------------|
| Senior Team  | Standings, Players, Results, Fixtures, Performance        |
| Women's Team | Players, Results, Fixtures                                |
| Reserve Team | Players, Results, Fixtures                                |
| Youth Team   | Players, Results, Fixtures                                |

Performance is available **only** for the Senior Team. The Senior Team
Performance page supports competition selection:

1. FDH Championship
2. Airtel Cup
3. Castel Cup

Performance contains Competition, Medical, Minutes Played, Goals and Assists.

## Administration

An area at `/admin` supports club management with six modules:

| Module                    | Purpose                                        |
|---------------------------|------------------------------------------------|
| Player Registration       | Register players with team, position, DOB, fee |
| Transfers                 | Record incoming and outgoing player transfers  |
| Weekly Budget Preparation | Build weekly budgets and line items            |
| Petty Cash                | Track small cash inflows/outflows + balance    |
| Staff Allowance           | Manage allowance payments for club staff       |
| Training Allocation       | Schedule team training sessions with budgets   |
| News & Announcements      | Publish news for the public news page          |
| Match Media & Highlights  | Add highlights, videos and photos              |
| Match Tickets             | Open ticket sales per fixture with categories, |
|                           | priced by stand, capacity-tracked bookings     |
| Payment Reconciliation    | Verify fan mobile-money payments, confirm     |
|                           | bookings/memberships and track revenue         |
| Announcements             | Short pinned updates shown on the home page    |
| Sponsors & Partners       | Manage supporters shown on home / About        |
| Fan Messages              | Read messages sent via the Contact page        |
| Site Settings             | Edit contact details, socials & club info      |
| Dashboard & Reports       | Aggregated football/admin/fan reports          |

Each module provides a data-entry form (server actions writing to Supabase) and
a list of the existing records. Admin tables start empty — records are entered
by club staff; no financial or operational data is invented.

## Digital fan modules

Public pages delivered to fans on any device:

| Page                  | Purpose                                              |
|-----------------------|------------------------------------------------------|
| `/`                   | Home — hero, next match, announcements, modules, teams, sponsors |
| `/match-centre`       | Live match data                              |
| `/news`               | Club news and announcements                   |
| `/gallery`            | Photo gallery (media of type photo)           |
| `/media`              | Match highlights, videos and photos           |
| `/tickets`            | Match ticket booking (atomic `book_tickets` RPC) |
| `/membership`         | Fan membership signup                         |
| `/about`              | About the club + supporters & partners        |
| `/contact`            | Contact details + fan message form            |

The app is a **PWA**: it ships a web manifest, home-screen icons (generated
with `pnpm icons`) and a service worker, so it can be installed on phones
when served over HTTPS.

## Running across devices

`pnpm dev` and `pnpm start` bind to `0.0.0.0` on port **3100**, so the app is
available from any PC or phone on the same network — open
`http://<this-machine-ip>:3100` (e.g. `http://10.156.116.122:3100`). Remote
origins are allowed through `allowedDevOrigins` in `next.config.mjs`; update it
if your network assigns a new IP. For a public URL enable a tunnel (Cloudflare
Quick Tunnel: `cloudflared tunnel --url http://localhost:3100`) or deploy to
Vercel.

## Digital fan platform

Public, fan-facing modules live at the top level:

| Route          | Module                                             |
|----------------|----------------------------------------------------|
| `/match-centre`| Live match centre — live/today, results, fixtures, stats, squads |
| `/news`        | News & announcements (article list + detail)       |
| `/media`       | Match highlights, videos and photos                |
| `/tickets`     | Match tickets — per-fixture stands with a booking form |
| `/membership`  | Fan membership — tier overview + signup form       |

- The **Live Match Centre** is read-only and derives scores, form, statistics,
  squads and line-ups exclusively from the supplied fixtures, results,
  performance, standings and player data. No match data is invented.
- **News**, **media** and **ticket allocations** start empty and are entered by
  staff through the admin area (`/admin/news`, `/admin/media`, `/admin/tickets`).
- **Tickets** and **memberships** are self-served by fans through public forms,
  which write to Supabase when configured. Paid items raise a payment request
  that fans settle by mobile money; staff reconcile each payment in
  `/admin/payments`.

## Online payments

Paid ticket bookings (per the stored stand price) and paid memberships (Gold:
MK 15,000, Family: MK 30,000) create a pending `payment_transactions` record
with the amount computed **server-side** — the fan never supplies a price. On
the payment panel the fan is shown the amount, the amount to quote and the
club's mobile-money wallet numbers (admin-editable in `/admin/settings`), then
enters their wallet transaction reference.

Confirmation is controlled by `PAYMENT_MODE`:

| Mode    | Behaviour                                                                 |
|---------|---------------------------------------------------------------------------|
| sandbox | Payments auto-confirm — demonstration only, never with real money.         |
| manual  | Payments stay pending until staff verify the reference against the club's  |
|         | mobile-money account and confirm in `/admin/payments`.                     |

A real mobile-money/online gateway (Mpamba, Airtel Money or an aggregator) can
be added later behind the same database functions (`create_payment`,
`record_payment_reference`, `confirm_payment`) without changing the fan flow,
the payments table or the admin reconciliation screen. The wallet numbers fans
pay into are set in Site Settings (`payment_to_mpamba`, `payment_to_airtel`,
`payment_instructions`).

Fans complete payments at `/tickets` and `/membership`; staff reconcile all
transactions in `/admin/payments`, which also powers payment figures on the
admin dashboard and `/admin/reports`.

## Player profiles

Clicking a player opens their profile with:

- Squad number
- Position
- Strong foot
- Age
- Goals
- Assists

Only fields with provided data are populated; missing values are left empty.

## Database

Relational schema with tables for teams, players, competitions, standings,
fixtures, results, and performance (competition, medical, minutes played, goals,
assists). Every player belongs to a team; fixtures/results belong to a team;
performance belongs to the Senior Team and is connected to a competition.

Administration tables: `registrations`, `transfers`, `weekly_budgets`
(+ `budget_items`), `petty_cash_transactions`, `staff_allowances`, and
`training_allocations`. These require a signed-in staff user (Supabase Auth)
to read or write.

Digital tables (migration `000002_digital.sql`): `news_articles`, `media_items`,
`ticket_allocations`, `ticket_bookings`, `memberships`. News, media and ticket
allocations are publicly readable but staff-authors only; ticket bookings and
memberships can be submitted by any fan but only read back by signed-in staff.

Schema lives in `supabase/migrations/` (core in `000000_ekhaya_nexus.sql`,
administration in `000001_admin.sql`, digital in `000002_digital.sql`, auth +
storage + RLS hardening in `000003_auth_storage.sql`, Senior Team squad
numbers in `000004_players_squad.sql`, atomic ticket booking RPC in
`000005_book_tickets_rpc.sql`), seed data in
`supabase/seed/seed.sql`.
The app runs without a database using in-memory seed data.

When Supabase is not yet configured (env vars absent), the app serves the same
supplied data in-memory so development and testing work immediately. Once you
connect Supabase and run the migration + seed, the app reads from the database.

## Connecting everything

The diagram of the system:

```text
Ekhaya FC App (Next.js)
 ├── Fan Application        (public pages: fixtures, results, media, tickets,…)
 └── Admin Panel            (/admin — protected by Supabase Auth)
           │
           ▼
       Supabase
 ├── Database  ──►  PostgreSQL (migrations + seed, RLS policies)
 ├── Auth      ──►  staff sign-in at /admin/login, session cookies, middleware guard
 └── Storage   ──►  `ekhaya-media` public bucket (media form uploads)
```

To connect the app to a live Supabase project:

1. Set the environment variables in `.env.local`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` (for local migrations).
2. Apply the schema and seed (`pnpm db:migrate`, `pnpm db:seed`) — this
   creates the tables, RLS policies, and the `ekhaya-media` storage bucket.
3. Create a staff account: Supabase Dashboard → Authentication → Users →
   **Invite user** (e.g. `admin@ekhaya.fc`).
4. Visit `/admin/login` and sign in. The middleware now unlocks `/admin`;
   the sign-in email appears in the admin header with a sign-out button.
5. Upload photos and highlights in `/admin/media` — files are stored in
   Supabase Storage and linked from `media_items`.

While the Supabase env vars are absent, the app runs in-memory and the admin
area is open for exploration (the dashboard shows an amber "in-memory mode"
banner).

## Setup

```bash
pnpm install
cp .env.example .env.local   # add Supabase URL + anon key (optional)
```

For a local Supabase database:

```bash
pnpm db:start
pnpm db:migrate   # or: supabase db push
pnpm db:seed      # or: supabase db reset
```

## Run

```bash
pnpm dev          # development
pnpm build        # production build
pnpm start        # start production build
```

## Commands

- `pnpm typecheck` — TypeScript type checking
- `pnpm lint` — ESLint

## Environment variables

| Variable                    | Purpose                    |
|-----------------------------|----------------------------|
| `NEXT_PUBLIC_SUPABASE_URL`  | Supabase project URL       |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key        |
| `SUPABASE_SERVICE_ROLE_KEY` | Service-role key (admin)   |
| `PAYMENT_MODE`              | `sandbox` (demo) or `manual` (staff-verified payments) |
