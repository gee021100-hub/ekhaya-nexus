-- Ekhaya App: Digital transformation schema
-- News & announcements, match media, match tickets and fan membership.
-- All tables start empty; records are entered via the app forms.

-- News articles
CREATE TABLE news_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  summary TEXT,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'News' CHECK (category IN ('News', 'Club', 'Match', 'Transfer', 'Community')),
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_news_published ON news_articles(published_at DESC);

-- Media items (match highlights, video, photos)
CREATE TABLE media_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('video', 'photo', 'highlight')),
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_published ON media_items(published_at DESC);

-- Ticket allocations (admin configures ticket runs per fixture)
CREATE TABLE ticket_allocations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fixture_id UUID REFERENCES fixtures(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('Open Stand', 'Covered Stand', 'VIP Stand', 'Corporate Box')),
  price NUMERIC(12,2) NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 0,
  sold INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'sold_out', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ticket_allocations_fixture ON ticket_allocations(fixture_id);

-- Ticket bookings (fans buy through the tickets page)
CREATE TABLE ticket_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  allocation_id UUID REFERENCES ticket_allocations(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  total_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  reference TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  booking_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ticket_bookings_booking_date ON ticket_bookings(booking_date DESC);

-- Fan memberships (fans register through the membership page)
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  member_type TEXT NOT NULL CHECK (member_type IN ('supporter', 'gold', 'family', 'corporate')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'cancelled')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_memberships_joined ON memberships(joined_at DESC);

-- Enable RLS on all digital tables
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- Public read policies (public sports app; admin reads through the same anon client)
CREATE POLICY "Public read news_articles" ON news_articles FOR SELECT USING (true);
CREATE POLICY "Public read media_items" ON media_items FOR SELECT USING (true);
CREATE POLICY "Public read ticket_allocations" ON ticket_allocations FOR SELECT USING (true);
CREATE POLICY "Public read ticket_bookings" ON ticket_bookings FOR SELECT USING (true);
CREATE POLICY "Public read memberships" ON memberships FOR SELECT USING (true);

-- Public insert policies (admin enters news/media/ticket runs; fans self-serve
-- bookings and membership signups through the public forms)
CREATE POLICY "Public insert news_articles" ON news_articles FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert media_items" ON media_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert ticket_allocations" ON ticket_allocations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert ticket_bookings" ON ticket_bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert memberships" ON memberships FOR INSERT WITH CHECK (true);