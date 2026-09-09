# Agent instructions

Work-here conventions for the Ekhaya Nexus platform.

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
- Player profiles contain Name, Strong foot, Age, Position, Goals, Assists —
  only populate fields for which data has been provided. Missing data stays
  empty (do not convert to fake zeros that aren't in the data).
- Database schema lives in `supabase/migrations/`; seed in
  `supabase/seed/seed.sql`.
- When Supabase env vars (`NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`) are absent, `lib/data.ts` falls back to the
  in-memory seed so the app runs without a database. Keep the fallback in sync
  with the SQL seed.
- Do not add Membership, Finance, Communication or unrelated modules.
- No invented football data, players, match results, fixtures or statistics.
- The UI is responsive on desktop, tablet and mobile.
