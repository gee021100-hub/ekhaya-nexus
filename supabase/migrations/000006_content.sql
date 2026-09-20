-- Ekhaya App: Club content & fan messaging schema
-- Announcements, sponsors and editable site settings (staff-managed, shown on
-- public pages) plus contact messages submitted by fans via the Contact page.
-- Announcements, sponsors and settings start empty; staff enter them through
-- the admin area. Contact messages are collected from the public form.

-- Announcements (shown on the home page)
CREATE TABLE announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  body TEXT,
  type TEXT NOT NULL DEFAULT 'Announcement' CHECK (type IN ('Announcement', 'Club', 'Match', 'Tickets', 'Community')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_announcements_published ON announcements(published_at DESC);

-- Sponsors & partners (shown on the home page and About page)
CREATE TABLE sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Partner' CHECK (level IN ('Official Partner', 'Gold', 'Silver', 'Community')),
  website TEXT,
  logo_url TEXT,
  description TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sponsors_enabled ON sponsors(sort_order, enabled);

-- Editable site settings (contact details, socials, home stadium, about text)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Fan contact messages (staff read them in the admin area)
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_messages_created ON contact_messages(created_at DESC);

-- Enable RLS on the content tables
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Public reads: content is displayed on public pages
CREATE POLICY "Public read announcements" ON announcements FOR SELECT USING (true);
CREATE POLICY "Public read sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);

-- Staff writes: signed-in admins manage content through the admin area
CREATE POLICY "Staff insert announcements" ON announcements FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff update announcements" ON announcements FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff delete announcements" ON announcements FOR DELETE TO authenticated USING (true);
CREATE POLICY "Staff insert sponsors" ON sponsors FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff update sponsors" ON sponsors FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Staff delete sponsors" ON sponsors FOR DELETE TO authenticated USING (true);
CREATE POLICY "Staff upsert site_settings" ON site_settings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff update site_settings" ON site_settings FOR UPDATE TO authenticated USING (true);

-- Contact messages: fans write, staff read
CREATE POLICY "Fans leave messages" ON contact_messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Fans leave authenticated messages" ON contact_messages FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Staff read messages" ON contact_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff update messages" ON contact_messages FOR UPDATE TO authenticated USING (true);