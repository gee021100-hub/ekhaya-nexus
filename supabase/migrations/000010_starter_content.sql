-- Ekhaya App: Starter content for the public digital modules
--
-- Seeds the commercial/official-release news, sponsors, announcements, home
-- stadium + about copy, the official store catalogue and the first fan polls
-- and tray notifications so the live site is populated from day one. All of
-- it is staff-editable afterwards through the admin forms.
--
-- Guarded with fixed id/key constants and ON CONFLICT DO NOTHING so the
-- migration is safe to apply more than once.

-- News (commercial & official releases only — no invented results/statistics)
INSERT INTO news_articles (id, title, summary, content, category, published_at) VALUES
('00000010-0000-0000-0000-000000000001',
 'Union Building Contractors Extend Ekhaya FC Sponsorship for Two More Years',
 'Ekhaya FC have confirmed a two-year extension of their official partnership with Union Building Contractors (UBC), boosting player performance incentives and club infrastructure.',
 'Ekhaya FC have received a timely boost into the season after confirming a two-year extension of their partnership with Union Building Contractors (UBC).

The renewed agreement, which now runs for the next two seasons, includes a significant increase in player incentives, specifically funding the prestigious monthly Player of the Month award to inspire excellence on the pitch.

Club CEO Thando Mhango expressed deep gratitude to UBC for their continued belief in the Ekhaya FC vision and community development through football.',
 'Club', '2026-09-15 10:00+02:00'),
('00000010-0000-0000-0000-000000000002',
 'Ekhaya FC Unveil Stevensons Paint as Main Shirt Sponsor in Historic MWK 300M Agreement',
 'Stevensons Paint steps up from sleeve sponsor to official front-of-shirt partner in a milestone agreement worth MWK 300 million.',
 'Ekhaya FC has unveiled Stevensons Paint as its new main shirt sponsor following an upgraded one-year deal worth MWK 300 million.

The landmark partnership sees Stevensons Paint step up to the front of all official first team and replica match shirts, symbolizing a natural progression in a long-standing commercial relationship.

The new kit featuring Stevensons Paint on the chest was met with enthusiastic celebration by supporters at Mpira Stadium.',
 'Club', '2026-04-24 09:00+02:00'),
('00000010-0000-0000-0000-000000000003',
 'Ekhaya FC Secure Enkosi Coaches as Official Matchday Sleeve Sponsor',
 'Luxury transport provider Enkosi Coaches partners with Ekhaya FC for official sleeve branding and team travel across Malawi.',
 'Ekhaya FC is pleased to announce Enkosi Coaches as the club''s new official sleeve sponsor on a one-year agreement.

The partnership sees Enkosi Coaches branding feature prominently on the sleeves of the matchday kits, further strengthening the club''s commercial portfolio.',
 'Club', '2026-04-21 09:00+02:00'),
('00000010-0000-0000-0000-000000000004',
 'Ekhaya FC Appoint Leonard Odipo as Technical Director on Three-Year Agreement',
 'CAF-licensed and KNVB-certified tactician Leonard Odipo arrives to spearhead football philosophy across all Ekhaya FC squads.',
 'Ekhaya FC is pleased to announce the appointment of Leonard Odipo as the club''s new Technical Director on a three-year deal.

Odipo is a CAF-licensed coach and holds the prestigious KNVB (Dutch) Advanced Coaching Certificate, with extensive experience coaching in top African leagues.

In his new role, Odipo will oversee technical development pathways across the Senior Men, Women, Reserves, and Youth Academy.',
 'News', '2026-03-27 09:00+02:00')
ON CONFLICT (id) DO NOTHING;

-- Announcements (home page)
INSERT INTO announcements (id, title, body, type, published_at, is_pinned) VALUES
('00000010-0000-0000-0000-000000000101',
 'The Ekhaya FC Official Store is live',
 'Order the 2026/27 home and away jerseys, the Heritage Bull Heavyweight Hoodie, matchday scarves and more from the store. Collect your order in Blantyre or Lilongwe, or at the next home fixture.',
 'Announcement', '2026-09-20 08:00+02:00', true),
('00000010-0000-0000-0000-000000000102',
 'Welcome to the new Ekhaya App',
 'Official club news, match tickets, khaya membership, the official store and fan polls — all in one place. More features arriving soon.',
 'Club', '2026-09-20 08:00+02:00', false)
ON CONFLICT (id) DO NOTHING;

-- Sponsors
INSERT INTO sponsors (id, name, level, description, sort_order) VALUES
('00000010-0000-0000-0000-000000000201',
 'Union Building Contractors', 'Official Partner',
 'Official partner of Ekhaya FC. UBC funding supports player performance incentives and the monthly Player of the Month award.', 1),
('00000010-0000-0000-0000-000000000202',
 'Stevensons Paint', 'Gold',
 'Main shirt sponsor of the 2026/27 season. Stevensons Paint brand leads the front of all official first team and replica match shirts.', 2),
('00000010-0000-0000-0000-000000000203',
 'Enkosi Coaches', 'Gold',
 'Official matchday sleeve sponsor and luxury team travel partner across Malawi.', 3)
ON CONFLICT (id) DO NOTHING;

-- Site settings (contact numbers/socials/wallets stay empty for staff to fill)
INSERT INTO site_settings (key, value) VALUES
('stadium_name', 'Mpira Stadium, Chiwembe, Blantyre'),
('about_blurb', 'Ekhaya FC is a Malawian football club based in Blantyre. Home matches are played at Mpira Stadium, and supporters follow the club through the Ekhaya App — official news, the store, tickets, membership and more.')
ON CONFLICT (key) DO NOTHING;

-- Store catalogue
INSERT INTO store_products (id, name, category, price, original_price, description, image_url, sizes, customizable, in_stock, badge, sort_order) VALUES
('00000010-0000-0000-0000-000000000301',
 '2026/27 Official Home Match Jersey', 'Kits', 65000, 75000,
 'Crafted in deep obsidian black with championship gold accents and an embossed bull horns watermark on breathable AeroCool moisture-wicking fabric. Includes silicone club crest.',
 'https://images.unsplash.com/photo-1577212017184-80cc0da11082?auto=format&fit=crop&w=800&q=80',
 ARRAY['S','M','L','XL','2XL'], true, true, 'Bestseller', 1),
('00000010-0000-0000-0000-000000000302',
 '2026/27 Official Away Jersey — Ivory Gold', 'Kits', 65000, NULL,
 'Crisp ivory white canvas with shimmering gold trim and emerald accents. Inspired by the purity and courage of the herd.',
 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
 ARRAY['S','M','L','XL','2XL'], true, true, 'New', 2),
('00000010-0000-0000-0000-000000000303',
 'Ekhaya FC Heritage Bull Heavyweight Hoodie', 'Fashion', 52000, 60000,
 'Ultra-plush 450gsm organic cotton fleece with an embroidered gold MMXXII bull crest on the chest and custom Ekhaya drawstrings.',
 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
 ARRAY['S','M','L','XL'], false, true, 'Limited Edition', 3),
('00000010-0000-0000-0000-000000000304',
 'Official Club Matchday Scarf — "Abafana Basekhaya"', 'Accessories', 22000, NULL,
 'Classic double-knit jacquard stadium scarf featuring the club name, the Roman MMXXII founding year, and tassels.',
 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
 ARRAY[]::text[], false, true, NULL, 4),
('00000010-0000-0000-0000-000000000305',
 'Ekhaya FC Gold Bull Curved Peak Snapback', 'Accessories', 25000, NULL,
 'Structured 6-panel premium wool blend cap with 3D metallic gold bull embroidery and an engraved buckle.',
 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
 ARRAY[]::text[], false, true, NULL, 5),
('00000010-0000-0000-0000-000000000306',
 'Pro-Tech Squad Quarter-Zip Training Top', 'Training', 48000, NULL,
 'As worn by the first team squad during tactical preparations. Engineered with thumb loops and thermal regulation mesh.',
 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
 ARRAY['S','M','L','XL'], false, true, NULL, 6)
ON CONFLICT (id) DO NOTHING;

-- Fan polls (evergreen engagement — no invented fixtures/results)
INSERT INTO fan_polls (id, question, category, description, options, active) VALUES
('00000010-0000-0000-0000-000000000401',
 'What tactical shape should the coaching staff deploy in our upcoming league fixtures?',
 'Tactics & Coach',
 'Choose the formation you believe gives Ekhaya FC the best chance of three points at home.',
 '[{"id":"opt-1","text":"Fluid 4-3-3 — high pressing and wide wing overloads"},{"id":"opt-2","text":"Compact 4-2-3-1 — controlled possession with a double pivot"},{"id":"opt-3","text":"Direct 4-4-2 — twin strikers inside the box"}]',
 true),
('00000010-0000-0000-0000-000000000402',
 'How do you rate the squad''s defensive organization so far this season?',
 'Team Performance',
 'Give your technical rating of our backline and midfield screen.',
 '[{"id":"opt-1","text":"Exceptional — resilient and well organized"},{"id":"opt-2","text":"Good, but sharper transition recovery needed"},{"id":"opt-3","text":"Average — too reliant on individual saves"},{"id":"opt-4","text":"Needs strengthening in the next window"}]',
 true),
('00000010-0000-0000-0000-000000000403',
 'What should the Ekhaya App bring supporters next?',
 'Club Future',
 'Help us shape the next features of the official club app.',
 '[{"id":"opt-1","text":"Exclusive kit drops and member-only discounts"},{"id":"opt-2","text":"Live match streaming"},{"id":"opt-3","text":"Player meet-and-greets"},{"id":"opt-4","text":"A dedicated supporters'' forum"}]',
 true)
ON CONFLICT (id) DO NOTHING;

-- Tray notifications
INSERT INTO fan_notifications (id, title, message, category, published_at) VALUES
('00000010-0000-0000-0000-000000000501',
 'Official Store is now live',
 'Shop the 2026/27 home and away jerseys, the Heritage Bull Heavyweight Hoodie and matchday scarves. Pickup in Blantyre or Lilongwe.',
 'store', '2026-09-20 08:30+02:00'),
('00000010-0000-0000-0000-000000000502',
 'Newsroom now on the app',
 'Follow every official club release and commercial announcement straight from the Ekhaya App newsroom.',
 'news', '2026-09-20 08:30+02:00'),
('00000010-0000-0000-0000-000000000503',
 'Tickets & membership launched',
 'Book match tickets and register your khaya membership in minutes from your phone.',
 'ticket', '2026-09-20 08:30+02:00')
ON CONFLICT (id) DO NOTHING;