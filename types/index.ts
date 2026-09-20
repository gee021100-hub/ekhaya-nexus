export type ID = string;

export interface Team {
  id: ID;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Player {
  id: ID;
  team_id: ID;
  name: string;
  number: number | null;
  strong_foot: string | null;
  age: number | null;
  position: string | null;
  goals: number | null;
  assists: number | null;
  created_at: string;
}

export interface Competition {
  id: ID;
  name: string;
  created_at: string;
}

export interface Standing {
  id: ID;
  position: number;
  team_name: string;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  goal_difference: number;
  points: number;
  created_at: string;
}

export interface Fixture {
  id: ID;
  team_id: ID;
  home_team: string;
  away_team: string;
  match_date: string;
  match_time: string | null;
  competition_id: ID | null;
  competition_name?: string | null;
  created_at: string;
}

export interface Result {
  id: ID;
  team_id: ID;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  match_date: string;
  match_time: string | null;
  competition_id: ID | null;
  competition_name?: string | null;
  created_at: string;
}

export interface Performance {
  id: ID;
  player_id: ID;
  competition_id: ID;
  goals: number | null;
  assists: number | null;
  medical: string | null;
  minutes_played: number | null;
  player_name?: string;
  competition_name?: string;
  created_at: string;
}

export type TeamSlug = 'senior' | 'women' | 'reserve' | 'youth';

export interface Registration {
  id: ID;
  team_id: ID;
  player_name: string;
  position: string | null;
  date_of_birth: string | null;
  registration_date: string;
  fee_amount: number | null;
  status: 'pending' | 'approved' | 'rejected';
  notes: string | null;
  created_at: string;
}

export interface Transfer {
  id: ID;
  team_id: ID;
  player_name: string;
  transfer_type: 'in' | 'out';
  other_club: string;
  transfer_date: string;
  fee_amount: number | null;
  status: 'pending' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
}

export interface WeeklyBudget {
  id: ID;
  week_start: string;
  week_end: string;
  status: 'draft' | 'approved' | 'paid';
  notes: string | null;
  created_at: string;
  items?: BudgetItem[];
}

export interface BudgetItem {
  id: ID;
  budget_id: ID;
  category: string;
  description: string | null;
  planned_amount: number | null;
  actual_amount: number | null;
  created_at: string;
}

export interface PettyCashTransaction {
  id: ID;
  transaction_date: string;
  transaction_type: 'in' | 'out';
  description: string;
  amount: number | null;
  category: string | null;
  requestor: string | null;
  approved_by: string | null;
  notes: string | null;
  created_at: string;
}

export interface StaffAllowance {
  id: ID;
  team_id: ID | null;
  staff_name: string;
  role: string | null;
  period_start: string;
  period_end: string;
  amount: number | null;
  status: 'pending' | 'paid';
  notes: string | null;
  created_at: string;
}

export interface TrainingAllocation {
  id: ID;
  team_id: ID;
  training_date: string;
  location: string | null;
  session_type: string | null;
  description: string | null;
  players_invited: number | null;
  budget_amount: number | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface NewsArticle {
  id: ID;
  title: string;
  summary: string | null;
  content: string;
  category: string;
  published_at: string;
  created_at: string;
}

export interface MediaItem {
  id: ID;
  title: string;
  media_type: 'video' | 'photo' | 'highlight';
  url: string;
  thumbnail_url: string | null;
  published_at: string;
  created_at: string;
}

export interface TicketAllocation {
  id: ID;
  fixture_id: ID | null;
  category: string;
  price: number | null;
  capacity: number | null;
  sold: number | null;
  status: 'available' | 'sold_out' | 'cancelled';
  created_at: string;
  home_team?: string | null;
  away_team?: string | null;
  match_date?: string | null;
  fixture_name?: string | null;
}

export interface TicketBooking {
  id: ID;
  allocation_id: ID | null;
  full_name: string;
  email: string;
  phone: string | null;
  quantity: number | null;
  total_amount: number | null;
  reference: string;
  status: 'confirmed' | 'cancelled';
  payment_status: 'pending' | 'paid';
  booking_date: string;
  created_at: string;
}

export interface Membership {
  id: ID;
  full_name: string;
  email: string;
  phone: string | null;
  member_type: string;
  status: 'pending' | 'active' | 'cancelled';
  joined_at: string;
  created_at: string;
}

export type PaymentMode = 'sandbox' | 'manual';

export type PaymentStatus = 'pending' | 'confirmed' | 'failed' | 'refunded';

export interface PaymentTransaction {
  id: ID;
  reference: string;
  booking_type: 'ticket' | 'membership' | 'store';
  booking_id: ID;
  amount: number | null;
  method: 'mobile_money' | 'provider';
  provider: string | null;
  phone: string | null;
  customer_name: string | null;
  customer_email: string | null;
  provider_reference: string | null;
  status: PaymentStatus;
  confirmed_at: string | null;
  created_at: string;
}

export interface Announcement {
  id: ID;
  title: string;
  body: string | null;
  type: string;
  published_at: string;
  is_pinned: boolean;
  enabled: boolean;
  created_at: string;
}

export interface Sponsor {
  id: ID;
  name: string;
  level: string;
  website: string | null;
  logo_url: string | null;
  description: string | null;
  sort_order: number;
  enabled: boolean;
  created_at: string;
}

export interface SiteSettings {
  contact_email: string | null;
  contact_phone: string | null;
  contact_address: string | null;
  stadium_name: string | null;
  ticket_office: string | null;
  facebook: string | null;
  instagram: string | null;
  x_handle: string | null;
  tiktok: string | null;
  about_blurb: string | null;
  payment_to_mpamba: string | null;
  payment_to_airtel: string | null;
  payment_instructions: string | null;
}

/** Editable site settings exposed to the admin "Settings" module. */
export const SITE_SETTING_FIELDS: { key: keyof SiteSettings; label: string; placeholder: string }[] = [
  { key: 'contact_email', label: 'Contact email', placeholder: 'info@ekhaya-fc.mw' },
  { key: 'contact_phone', label: 'Contact phone', placeholder: '+265 9XX XXX XXX' },
  { key: 'contact_address', label: 'Club address', placeholder: 'Street, Town, Malawi' },
  { key: 'stadium_name', label: 'Home stadium', placeholder: 'Name of the home stadium' },
  { key: 'ticket_office', label: 'Ticket office notes', placeholder: 'Where and when tickets are sold' },
  { key: 'facebook', label: 'Facebook', placeholder: 'facebook.com/yourpage' },
  { key: 'instagram', label: 'Instagram', placeholder: 'instagram.com/yourhandle' },
  { key: 'x_handle', label: 'X / Twitter', placeholder: '@yourhandle' },
  { key: 'tiktok', label: 'TikTok', placeholder: 'tiktok.com/@yourhandle' },
  { key: 'about_blurb', label: 'About the club (public)', placeholder: 'A short paragraph about Ekhaya FC' },
  { key: 'payment_to_mpamba', label: 'Payment wallet — Mpamba', placeholder: 'e.g. 0XX XXX XXX' },
  { key: 'payment_to_airtel', label: 'Payment wallet — Airtel Money', placeholder: 'e.g. 0XX XXX XXX' },
  { key: 'payment_instructions', label: 'Payment instructions (public)', placeholder: 'How fans should pay by mobile money and what to enter as the reference' },
];

export interface ContactMessage {
  id: ID;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: 'new' | 'read' | 'archived';
  created_at: string;
}

export type AppEventLevel = 'info' | 'warn' | 'error';

export interface AppEvent {
  id: ID;
  level: AppEventLevel;
  scope: string;
  message: string;
  stack: string | null;
  data: Record<string, unknown> | null;
  path: string | null;
  created_at: string;
}

export interface MembershipTier {
  slug: string;
  name: string;
  price: string;
  /** Numeric MK amount for the season, or null when there is no online price. */
  priceValue: number | null;
  description: string;
  benefits: string[];
  featured?: boolean;
}

export const MEMBERSHIP_TIERS: MembershipTier[] = [
  {
    slug: 'supporter',
    name: 'Supporter',
    price: 'Free',
    priceValue: 0,
    description: 'The digital home of Ekhaya — follow every match and stay close to the club.',
    benefits: [
      'Live match centre access',
      'Club news and announcements',
      'Fixtures, results and standings',
      'Match highlights and media',
    ],
  },
  {
    slug: 'gold',
    name: 'Gold Member',
    price: 'MK 15,000 / season',
    priceValue: 15000,
    description: 'For the fans who never miss a moment in green and gold.',
    featured: true,
    benefits: [
      'Everything in Supporter',
      'Priority access to match tickets',
      'Gold member match-day stand',
      '10% discount at the Ekhaya FC store',
      'Members-only competitions',
    ],
  },
  {
    slug: 'family',
    name: 'Family',
    price: 'MK 30,000 / season',
    priceValue: 30000,
    description: 'Bring the whole family to every home game together.',
    benefits: [
      'Everything in Gold',
      'Family match-day package (4 seats)',
      'Junior supporter pack',
      'Invitations to family fan events',
    ],
  },
  {
    slug: 'corporate',
    name: 'Corporate',
    price: 'Contact us',
    priceValue: null,
    description: 'Partner with Ekhaya FC and unlock premium match-day experiences.',
    benefits: [
      'Everything in Gold',
      'VIP hospitality on match days',
      'Branding and sponsorship packages',
      'Private player & staff access days',
    ],
  },
];

export const TICKET_CATEGORIES = ['Open Stand', 'Covered Stand', 'VIP Stand', 'Corporate Box'] as const;

export const STORE_CATEGORIES = ['Kits', 'Training', 'Fashion', 'Accessories', 'Collectibles'] as const;
export type StoreCategory = (typeof STORE_CATEGORIES)[number];

export interface StoreProduct {
  id: ID;
  name: string;
  category: StoreCategory;
  price: number | null;
  original_price: number | null;
  description: string | null;
  image_url: string | null;
  sizes: string[];
  customizable: boolean;
  in_stock: boolean;
  badge: string | null;
  sort_order: number;
  enabled: boolean;
  created_at: string;
}

export interface StoreOrderItem {
  product_id: ID;
  name: string;
  category: string;
  size: string | null;
  custom_text: string | null;
  unit_price: number;
  quantity: number;
}

export interface StoreOrder {
  id: ID;
  reference: string;
  items: StoreOrderItem[];
  subtotal: number | null;
  discount: number | null;
  total: number | null;
  delivery_option: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  payment_status: 'pending' | 'paid' | 'cancelled';
  created_at: string;
}

export const DELIVERY_OPTIONS = ['blantyre_pickup', 'lilongwe_pickup', 'event_pickup'] as const;
export const DELIVERY_OPTION_LABELS: Record<string, string> = {
  blantyre_pickup: 'Pick up — Blantyre club shop',
  lilongwe_pickup: 'Pick up — Lilongwe pop-up (match days)',
  event_pickup: 'Pick up — At the next home fixture',
};

export type PollOption = { id: string; text: string };

export interface FanPoll {
  id: ID;
  question: string;
  category: string;
  description: string | null;
  options: PollOption[];
  featured_match: string | null;
  active: boolean;
  ends_at: string | null;
  created_at: string;
}

export interface PollVoteRow {
  poll_id: ID;
  option_id: string;
  votes: number;
}

export const POLL_CATEGORIES = [
  'Match Prediction',
  'Team Performance',
  'Player of the Week',
  'Tactics & Coach',
  'Club Future',
] as const;

export const KHAYA_POINTS_PER_VOTE = 5;

export type FanNotificationCategory = 'match' | 'news' | 'ticket' | 'store' | 'admin';

export interface FanNotification {
  id: ID;
  title: string;
  message: string;
  category: FanNotificationCategory;
  published_at: string;
  enabled: boolean;
  created_at: string;
}

export const NOTIFICATION_CATEGORIES: FanNotificationCategory[] = ['match', 'news', 'ticket', 'store', 'admin'];
export const NOTIFICATION_CATEGORY_LABELS: Record<FanNotificationCategory, string> = {
  match: 'Match day',
  news: 'Club news',
  ticket: 'Tickets',
  store: 'Store',
  admin: 'Club admin',
};

export interface TeamConfig {
  slug: TeamSlug;
  name: string;
  description: string;
  hasStandings: boolean;
  hasPerformance: boolean;
  hasResults: boolean;
  hasFixtures: boolean;
}

export const TEAMS: TeamConfig[] = [
  {
    slug: 'senior',
    name: 'Senior Team',
    description: 'Ekhaya FC Senior Team',
    hasStandings: true,
    hasPerformance: true,
    hasResults: true,
    hasFixtures: true,
  },
  {
    slug: 'women',
    name: "Women's Team",
    description: "Ekhaya FC Women's Team",
    hasStandings: false,
    hasPerformance: false,
    hasResults: true,
    hasFixtures: true,
  },
  {
    slug: 'reserve',
    name: 'Reserve Team',
    description: 'Ekhaya FC Reserve Team',
    hasStandings: false,
    hasPerformance: false,
    hasResults: true,
    hasFixtures: true,
  },
  {
    slug: 'youth',
    name: 'Youth Team',
    description: 'Ekhaya FC Youth Team',
    hasStandings: false,
    hasPerformance: false,
    hasResults: true,
    hasFixtures: true,
  },
];
