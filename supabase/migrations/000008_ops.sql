-- Ekhaya App: Ops & observability — app error/event log and privacy-friendly
-- page-view analytics.
--
-- app_events: server-side diagnostic log (errors, warnings, security events).
--   Written ONLY by the server (service role) via lib/telemetry.ts; the
--   public can never insert into it. Staff can read it back on the admin
--   dashboard (RLS authenticated).
--
-- analytics_page_views: lightweight, privacy-friendly visit stats used by the
--   admin Analytics page. No IPs, no user-identifiable data — only an
--   anonymized visitor hash (first 8 chars of sha256 of a random id cookie),
--   path, referrer host, device class, locale and viewport. The public can
--   INSERT (the client tracker sends these) but never SELECT.

/* ------------------------------------------------------------------ */
/*  1. app_events — server diagnostics                                */
/* ------------------------------------------------------------------ */

CREATE TABLE app_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL DEFAULT 'error' CHECK (level IN ('info', 'warn', 'error')),
  scope TEXT NOT NULL,
  message TEXT NOT NULL,
  stack TEXT,
  data JSONB,
  path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_app_events_created ON app_events(created_at DESC);
CREATE INDEX idx_app_events_scope ON app_events(scope);
CREATE INDEX idx_app_events_level ON app_events(level);

ALTER TABLE app_events ENABLE ROW LEVEL SECURITY;

-- Staff may read; writes are server/service-role only (no anon/authenticated
-- insert policy exists, so anonymous and signed-in users cannot log anything).
CREATE POLICY "Staff read app_events" ON app_events
  FOR SELECT TO authenticated USING (true);

/* ------------------------------------------------------------------ */
/*  2. analytics_page_views — visit stats                             */
/* ------------------------------------------------------------------ */

CREATE TABLE analytics_page_views (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  device TEXT,
  locale TEXT,
  visitor TEXT,
  viewport TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_views_created ON analytics_page_views(created_at DESC);
CREATE INDEX idx_analytics_views_path ON analytics_page_views(path);
CREATE INDEX idx_analytics_views_visitor ON analytics_page_views(visitor);

ALTER TABLE analytics_page_views ENABLE ROW LEVEL SECURITY;

-- The client tracker (component/page-view-tracker.tsx -> /api/track) inserts
-- anonymous stats; only staff can read them back.
CREATE POLICY "Record page views" ON analytics_page_views
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Staff read page views" ON analytics_page_views
  FOR SELECT TO authenticated USING (true);