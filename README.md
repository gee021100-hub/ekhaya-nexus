# EKHAYA NEXUS

Football team management and statistics web application for **Ekhaya FC**.

## Purpose

Manage exactly four teams — Senior, Women's, Reserve and Youth — with players,
profiles, results, fixtures, standings, and (Senior Team only) performance
statistics broken down by competition.

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

Each module provides a data-entry form (server actions writing to Supabase) and
a list of the existing records. Admin tables start empty — records are entered
by club staff; no financial or operational data is invented.

## Player profiles

Clicking a player opens their profile with:

- Name
- Strong foot
- Age
- Position
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
`training_allocations`. These have public read + insert RLS policies so staff
can add records through the admin area.

Schema lives in `supabase/migrations/` (core in `000000_ekhaya_nexus.sql`,
administration in `000001_admin.sql`), seed data in `supabase/seed/seed.sql`.

When Supabase is not yet configured (env vars absent), the app serves the same
supplied data in-memory so development and testing work immediately. Once you
connect Supabase and run the migration + seed, the app reads from the database.

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
