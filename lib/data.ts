import { createClient, supabaseConfigured } from '@/lib/supabase/server';
import type {
  Team,
  Player,
  Competition,
  Standing,
  Fixture,
  Result,
  Performance,
  Registration,
  Transfer,
  WeeklyBudget,
  BudgetItem,
  PettyCashTransaction,
  StaffAllowance,
  TrainingAllocation,
  NewsArticle,
  MediaItem,
  TicketAllocation,
  TicketBooking,
  Membership,
  Announcement,
  Sponsor,
  SiteSettings,
  ContactMessage,
  PaymentTransaction,
  AppEvent,
  StoreProduct,
  StoreOrder,
  FanPoll,
  FanNotification,
  PollVoteRow,
} from '@/types';

/* ------------------------------------------------------------------ */
/*  In-memory seed (used when Supabase env vars are absent)            */
/* ------------------------------------------------------------------ */

const SEED_TEAMS: Team[] = [
  { id: 'a1000000-0000-0000-0000-000000000001', name: 'Senior Team', slug: 'senior', description: 'Ekhaya FC Senior Team', created_at: '2026-01-01T00:00:00Z' },
  { id: 'a1000000-0000-0000-0000-000000000002', name: "Women's Team", slug: 'women', description: "Ekhaya FC Women's Team", created_at: '2026-01-01T00:00:00Z' },
  { id: 'a1000000-0000-0000-0000-000000000003', name: 'Reserve Team', slug: 'reserve', description: 'Ekhaya FC Reserve Team', created_at: '2026-01-01T00:00:00Z' },
  { id: 'a1000000-0000-0000-0000-000000000004', name: 'Youth Team', slug: 'youth', description: 'Ekhaya FC Youth Team', created_at: '2026-01-01T00:00:00Z' },
];

const SENIOR_ID = 'a1000000-0000-0000-0000-000000000001';

const SEED_COMPETITIONS: Competition[] = [
  { id: 'b1000000-0000-0000-0000-000000000001', name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'b1000000-0000-0000-0000-000000000002', name: 'Airtel Cup', created_at: '2026-01-01T00:00:00Z' },
  { id: 'b1000000-0000-0000-0000-000000000003', name: 'Castel Cup', created_at: '2026-01-01T00:00:00Z' },
];

const SEED_PLAYERS: Player[] = [
  { id: 'c1000000-0000-0000-0000-000000000024', team_id: SENIOR_ID, name: 'Amos Sande', number: 1, strong_foot: null, age: null, position: 'GK', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000012', team_id: SENIOR_ID, name: 'Vincent Salawira', number: 4, strong_foot: null, age: null, position: 'CDM', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000015', team_id: SENIOR_ID, name: 'Aubrey Simbi', number: 5, strong_foot: null, age: null, position: 'CB/RB', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000028', team_id: SENIOR_ID, name: 'Hadji James', number: 6, strong_foot: null, age: null, position: 'CDM', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000009', team_id: SENIOR_ID, name: 'Isaiah Nyirenda', number: 7, strong_foot: null, age: null, position: 'B2B/CAM', goals: null, assists: 2, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000018', team_id: SENIOR_ID, name: 'Moses Banda', number: 8, strong_foot: null, age: null, position: 'CDM', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000006', team_id: SENIOR_ID, name: 'James Stambuli', number: 9, strong_foot: null, age: null, position: 'CF/CAM', goals: 1, assists: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000003', team_id: SENIOR_ID, name: 'Chimwemwe Chunga', number: 11, strong_foot: null, age: null, position: 'RW', goals: 4, assists: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000023', team_id: SENIOR_ID, name: 'Alick Lungu', number: 12, strong_foot: null, age: null, position: 'LB', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000011', team_id: SENIOR_ID, name: 'Andrew Lameck', number: 14, strong_foot: null, age: null, position: 'CB/CDM', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000029', team_id: SENIOR_ID, name: 'Joseph Saiwa', number: 16, strong_foot: null, age: null, position: 'CB', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000013', team_id: SENIOR_ID, name: 'Hermas Masinja', number: 17, strong_foot: null, age: null, position: 'RB', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000014', team_id: SENIOR_ID, name: 'Happy Mphepo', number: 19, strong_foot: null, age: null, position: 'CB', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000001', team_id: SENIOR_ID, name: 'Allen Chihana', number: 20, strong_foot: null, age: null, position: 'RW/LW/CF/CAM', goals: 6, assists: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000007', team_id: SENIOR_ID, name: 'Charles Mafaiti', number: 21, strong_foot: null, age: null, position: 'CB', goals: 1, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000004', team_id: SENIOR_ID, name: 'James Lumbe', number: 25, strong_foot: null, age: null, position: 'LW/RW/CAM', goals: 2, assists: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000017', team_id: SENIOR_ID, name: 'Joseph McDonald', number: 26, strong_foot: null, age: null, position: 'CB', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000008', team_id: SENIOR_ID, name: 'Samuel Rukura', number: 29, strong_foot: null, age: null, position: 'LW/LB', goals: null, assists: 2, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000010', team_id: SENIOR_ID, name: 'Clever Mkungula', number: 31, strong_foot: null, age: null, position: 'GK', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000002', team_id: SENIOR_ID, name: 'Blessings Malinda', number: 47, strong_foot: null, age: null, position: 'CAM/B2B', goals: 5, assists: 2, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000005', team_id: SENIOR_ID, name: 'Levison Mnyenyembe', number: 98, strong_foot: null, age: null, position: 'LW/RW', goals: 1, assists: 4, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000030', team_id: SENIOR_ID, name: 'Joshua Waka', number: 99, strong_foot: null, age: null, position: 'GK', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000016', team_id: SENIOR_ID, name: 'Gift Chunga', number: null, strong_foot: null, age: null, position: 'CF', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000019', team_id: SENIOR_ID, name: 'Lucky Tizola', number: null, strong_foot: null, age: null, position: 'GK', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000020', team_id: SENIOR_ID, name: 'Wongani Kaponya', number: null, strong_foot: null, age: null, position: 'LW/RW', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000021', team_id: SENIOR_ID, name: 'Fanizo Mwansambo', number: null, strong_foot: null, age: null, position: 'CB', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000022', team_id: SENIOR_ID, name: 'Alfred Chizinga', number: null, strong_foot: null, age: null, position: 'CAM/CF', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000025', team_id: SENIOR_ID, name: 'Davie Juao', number: null, strong_foot: null, age: null, position: 'CF', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000026', team_id: SENIOR_ID, name: 'George Mateyo', number: null, strong_foot: null, age: null, position: 'RW', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000027', team_id: SENIOR_ID, name: 'Gift Magola', number: null, strong_foot: null, age: null, position: 'RW', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000031', team_id: SENIOR_ID, name: 'Limbani Kutambe', number: null, strong_foot: null, age: null, position: 'CDM', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000032', team_id: SENIOR_ID, name: 'Mudrick Salomu', number: null, strong_foot: null, age: null, position: 'CB', goals: null, assists: null, created_at: '2026-01-01T00:00:00Z' },
];

const SEED_STANDINGS: Standing[] = [
  { id: 'd1000000-0000-0000-0000-000000000001', position: 1, team_name: 'Big Bullets', played: 15, wins: 8, draws: 6, losses: 1, goals_for: 20, goals_against: 7, goal_difference: 13, points: 30, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000002', position: 2, team_name: 'Mighty Wanderers', played: 14, wins: 8, draws: 5, losses: 1, goals_for: 26, goals_against: 9, goal_difference: 17, points: 29, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000003', position: 3, team_name: 'Silver Strikers', played: 15, wins: 8, draws: 5, losses: 2, goals_for: 23, goals_against: 10, goal_difference: 13, points: 29, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000004', position: 4, team_name: 'Blue Eagles', played: 14, wins: 9, draws: 1, losses: 4, goals_for: 22, goals_against: 15, goal_difference: 7, points: 28, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000005', position: 5, team_name: 'Masters FC', played: 15, wins: 6, draws: 4, losses: 5, goals_for: 17, goals_against: 16, goal_difference: 1, points: 22, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000006', position: 6, team_name: 'Moyale Barracks', played: 15, wins: 5, draws: 6, losses: 4, goals_for: 16, goals_against: 17, goal_difference: -1, points: 21, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000007', position: 7, team_name: 'Chitipa United', played: 15, wins: 6, draws: 3, losses: 6, goals_for: 11, goals_against: 16, goal_difference: -5, points: 21, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000008', position: 8, team_name: 'Red Lions', played: 15, wins: 5, draws: 5, losses: 5, goals_for: 12, goals_against: 13, goal_difference: -1, points: 20, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000009', position: 9, team_name: 'Civo Utd', played: 15, wins: 6, draws: 2, losses: 7, goals_for: 10, goals_against: 14, goal_difference: -4, points: 20, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000010', position: 10, team_name: 'Mitundu Baptist', played: 14, wins: 5, draws: 4, losses: 5, goals_for: 12, goals_against: 13, goal_difference: -1, points: 19, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000011', position: 11, team_name: 'Ekhaya', played: 15, wins: 4, draws: 6, losses: 5, goals_for: 15, goals_against: 14, goal_difference: 1, points: 18, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000012', position: 12, team_name: 'Karonga United', played: 15, wins: 3, draws: 5, losses: 7, goals_for: 14, goals_against: 23, goal_difference: -9, points: 14, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000013', position: 13, team_name: 'Dedza Dynamos', played: 14, wins: 3, draws: 5, losses: 6, goals_for: 9, goals_against: 19, goal_difference: -10, points: 14, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000014', position: 14, team_name: 'MAFCO', played: 15, wins: 3, draws: 4, losses: 8, goals_for: 12, goals_against: 17, goal_difference: -5, points: 13, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000015', position: 15, team_name: 'Kamuzu Barracks', played: 15, wins: 3, draws: 3, losses: 9, goals_for: 15, goals_against: 22, goal_difference: -7, points: 12, created_at: '2026-01-01T00:00:00Z' },
  { id: 'd1000000-0000-0000-0000-000000000016', position: 16, team_name: 'Creck Sporting', played: 15, wins: 2, draws: 4, losses: 9, goals_for: 11, goals_against: 20, goal_difference: -9, points: 10, created_at: '2026-01-01T00:00:00Z' },
];

const SEED_FIXTURES: Fixture[] = [
  { id: 'e1000000-0000-0000-0000-000000000001', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Kamuzu Barracks', match_date: '2026-10-10', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000002', team_id: SENIOR_ID, home_team: 'Red Lions', away_team: 'Ekhaya', match_date: '2026-10-18', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000003', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Blue Eagles', match_date: '2026-10-25', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000004', team_id: SENIOR_ID, home_team: 'MAFCO', away_team: 'Ekhaya', match_date: '2026-11-01', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000005', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Civo Utd', match_date: '2026-11-21', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000006', team_id: SENIOR_ID, home_team: 'Masters FC', away_team: 'Ekhaya', match_date: '2026-11-28', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000007', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Mighty Wanderers', match_date: '2026-12-06', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000008', team_id: SENIOR_ID, home_team: 'Moyale Barracks', away_team: 'Ekhaya', match_date: '2026-12-12', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000009', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Mitundu Baptist', match_date: '2026-12-19', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000010', team_id: SENIOR_ID, home_team: 'Big Bullets', away_team: 'Ekhaya', match_date: '2027-01-03', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000011', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Chitipa United', match_date: '2027-01-16', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000012', team_id: SENIOR_ID, home_team: 'Dedza Dynamos', away_team: 'Ekhaya', match_date: '2027-01-25', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000013', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Silver Strikers', match_date: '2027-01-31', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000014', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Creck Sporting', match_date: '2027-02-06', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'e1000000-0000-0000-0000-000000000015', team_id: SENIOR_ID, home_team: 'Karonga United', away_team: 'Ekhaya', match_date: '2027-02-20', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
];

const SEED_RESULTS: Result[] = [
  { id: 'f1000000-0000-0000-0000-000000000001', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Karonga United', home_score: 0, away_score: 0, match_date: '2026-09-06', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000002', team_id: SENIOR_ID, home_team: 'Creck Sporting', away_team: 'Ekhaya', home_score: 3, away_score: 2, match_date: '2026-08-22', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000003', team_id: SENIOR_ID, home_team: 'Silver Strikers', away_team: 'Ekhaya', home_score: 3, away_score: 0, match_date: '2026-08-15', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000004', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Dedza Dynamos', home_score: 1, away_score: 1, match_date: '2026-08-08', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000005', team_id: SENIOR_ID, home_team: 'Chitipa United', away_team: 'Ekhaya', home_score: 1, away_score: 0, match_date: '2026-07-25', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000006', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Big Bullets', home_score: 0, away_score: 0, match_date: '2026-07-19', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000007', team_id: SENIOR_ID, home_team: 'Mitundu Baptist', away_team: 'Ekhaya', home_score: 0, away_score: 0, match_date: '2026-07-05', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000008', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'MAFCO', home_score: 1, away_score: 0, match_date: '2026-06-28', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000009', team_id: SENIOR_ID, home_team: 'Mighty Wanderers', away_team: 'Ekhaya', home_score: 1, away_score: 1, match_date: '2026-06-20', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000010', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Masters FC', home_score: 2, away_score: 0, match_date: '2026-05-30', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000011', team_id: SENIOR_ID, home_team: 'Kamuzu Barracks', away_team: 'Ekhaya', home_score: 1, away_score: 4, match_date: '2026-05-23', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000012', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Moyale Barracks', home_score: 2, away_score: 0, match_date: '2026-05-16', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000013', team_id: SENIOR_ID, home_team: 'Civo Utd', away_team: 'Ekhaya', home_score: 1, away_score: 0, match_date: '2026-05-09', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000014', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Red Lions', home_score: 1, away_score: 1, match_date: '2026-05-02', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000015', team_id: SENIOR_ID, home_team: 'Blue Eagles', away_team: 'Ekhaya', home_score: 2, away_score: 1, match_date: '2026-04-26', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'f1000000-0000-0000-0000-000000000016', team_id: SENIOR_ID, home_team: 'Ekhaya', away_team: 'Dedza Dynamos', home_score: 0, away_score: 2, match_date: '2027-01-24', match_time: '14:30:00', competition_id: null, competition_name: null, created_at: '2026-01-01T00:00:00Z' },
];

const SEED_PERFORMANCE: Performance[] = [
  // FDH Championship
  { id: 'g1000000-0000-0000-0000-000000000001', player_id: 'c1000000-0000-0000-0000-000000000001', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 2, assists: 1, medical: null, minutes_played: null, player_name: 'Allen Chihana', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000002', player_id: 'c1000000-0000-0000-0000-000000000002', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 4, assists: null, medical: null, minutes_played: null, player_name: 'Blessings Malinda', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000003', player_id: 'c1000000-0000-0000-0000-000000000003', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 4, assists: null, medical: null, minutes_played: null, player_name: 'Chimwemwe Chunga', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000004', player_id: 'c1000000-0000-0000-0000-000000000004', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 2, assists: null, medical: null, minutes_played: null, player_name: 'James Lumbe', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000005', player_id: 'c1000000-0000-0000-0000-000000000005', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 1, assists: 4, medical: null, minutes_played: null, player_name: 'Levison Mnyenyembe', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000006', player_id: 'c1000000-0000-0000-0000-000000000006', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 1, assists: 1, medical: null, minutes_played: null, player_name: 'James Stambuli', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000007', player_id: 'c1000000-0000-0000-0000-000000000007', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 1, assists: null, medical: null, minutes_played: null, player_name: 'Charles Mafaiti', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000008', player_id: 'c1000000-0000-0000-0000-000000000008', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: null, assists: 2, medical: null, minutes_played: null, player_name: 'Samuel Rukura', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000009', player_id: 'c1000000-0000-0000-0000-000000000009', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: null, assists: 1, medical: null, minutes_played: null, player_name: 'Isaiah Nyirenda', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
  // Airtel Cup
  { id: 'g1000000-0000-0000-0000-000000000010', player_id: 'c1000000-0000-0000-0000-000000000001', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: 4, assists: null, medical: null, minutes_played: null, player_name: 'Allen Chihana', competition_name: 'Airtel Cup', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000011', player_id: 'c1000000-0000-0000-0000-000000000002', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: null, assists: 2, medical: null, minutes_played: null, player_name: 'Blessings Malinda', competition_name: 'Airtel Cup', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000012', player_id: 'c1000000-0000-0000-0000-000000000003', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: 1, assists: 1, medical: null, minutes_played: null, player_name: 'Chimwemwe Chunga', competition_name: 'Airtel Cup', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000013', player_id: 'c1000000-0000-0000-0000-000000000004', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: null, assists: 1, medical: null, minutes_played: null, player_name: 'James Lumbe', competition_name: 'Airtel Cup', created_at: '2026-01-01T00:00:00Z' },
  { id: 'g1000000-0000-0000-0000-000000000014', player_id: 'c1000000-0000-0000-0000-000000000009', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: null, assists: 1, medical: null, minutes_played: null, player_name: 'Isaiah Nyirenda', competition_name: 'Airtel Cup', created_at: '2026-01-01T00:00:00Z' },
];

const SEED_REGISTRATIONS: Registration[] = [];
const SEED_TRANSFERS: Transfer[] = [];
const SEED_WEEKLY_BUDGETS: WeeklyBudget[] = [];
const SEED_PETTY_CASH: PettyCashTransaction[] = [];
const SEED_STAFF_ALLOWANCES: StaffAllowance[] = [];
const SEED_TRAINING_ALLOCATIONS: TrainingAllocation[] = [];

// The digital modules (news, media, tickets, memberships) start empty. No real
// articles, media, ticket runs or members have been provided — club staff and
// fans create records through the app forms, which persist via Supabase.
const SEED_NEWS_ARTICLES: NewsArticle[] = [];
const SEED_MEDIA_ITEMS: MediaItem[] = [];
const SEED_TICKET_ALLOCATIONS: TicketAllocation[] = [];
const SEED_TICKET_BOOKINGS: TicketBooking[] = [];
const SEED_MEMBERSHIPS: Membership[] = [];

// Club content is staff-managed; nothing is published until an admin adds it.
const SEED_ANNOUNCEMENTS: Announcement[] = [];
const SEED_SPONSORS: Sponsor[] = [];
const SEED_CONTACT_MESSAGES: ContactMessage[] = [];

// Default site settings. Only the club email already present in the app is
// included; everything else stays empty until staff fill it in /admin/settings.
const SEED_SITE_SETTINGS: SiteSettings = {
  contact_email: 'info@ekhaya-fc.mw',
  contact_phone: null,
  contact_address: null,
  stadium_name: null,
  ticket_office: null,
  facebook: null,
  instagram: null,
  x_handle: null,
  tiktok: null,
  about_blurb: null,
  payment_to_mpamba: null,
  payment_to_airtel: null,
  payment_instructions: null,
};

/* ------------------------------------------------------------------ */
/*  Supabase queries                                                   */
/* ------------------------------------------------------------------ */

async function dbGetTeams(): Promise<Team[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('teams').select('*').order('name');
  return (data as Team[]) ?? [];
}

async function dbGetTeamBySlug(slug: string): Promise<Team | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('teams').select('*').eq('slug', slug).maybeSingle();
  return (data as Team | null) ?? null;
}

async function dbGetPlayers(teamId: string): Promise<Player[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('players').select('*').eq('team_id', teamId).order('name');
  return (data as Player[]) ?? [];
}

async function dbGetPlayer(playerId: string): Promise<Player | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('players').select('*').eq('id', playerId).maybeSingle();
  return (data as Player | null) ?? null;
}

async function dbGetStandings(): Promise<Standing[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('standings').select('*').order('position');
  return (data as Standing[]) ?? [];
}

async function dbGetFixtures(teamId: string): Promise<Fixture[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('fixtures')
    .select('*, competitions(name)')
    .eq('team_id', teamId)
    .order('match_date', { ascending: true });
  if (!data) return [];
  return data.map((row: Record<string, unknown>) => ({
    ...(row as unknown as Fixture),
    competition_name: (row.competitions as { name: string } | null)?.name ?? null,
  })) as Fixture[];
}

async function dbGetResults(teamId: string): Promise<Result[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('results')
    .select('*, competitions(name)')
    .eq('team_id', teamId)
    .order('match_date', { ascending: false });
  if (!data) return [];
  return data.map((row: Record<string, unknown>) => ({
    ...(row as unknown as Result),
    competition_name: (row.competitions as { name: string } | null)?.name ?? null,
  })) as Result[];
}

async function dbGetPerformance(): Promise<Performance[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('performance')
    .select('*, players(name), competitions(name)');
  if (!data) return [];
  return data.map((row: Record<string, unknown>) => ({
    ...(row as unknown as Performance),
    player_name: (row.players as { name: string } | null)?.name ?? null,
    competition_name: (row.competitions as { name: string } | null)?.name ?? null,
  })) as Performance[];
}

async function dbGetCompetitions(): Promise<Competition[]> {
  const supabase = await createClient();
  const { data } = await supabase.from('competitions').select('*').order('name');
  return (data as Competition[]) ?? [];
}

async function dbGetRegistrations(): Promise<Registration[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('registrations')
    .select('*')
    .order('registration_date', { ascending: false });
  return (data as Registration[]) ?? [];
}

async function dbGetTransfers(): Promise<Transfer[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('transfers')
    .select('*')
    .order('transfer_date', { ascending: false });
  return (data as Transfer[]) ?? [];
}

async function dbGetWeeklyBudgets(): Promise<WeeklyBudget[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('weekly_budgets')
    .select('*, budget_items(*)')
    .order('week_start', { ascending: false });
  if (!data) return [];
  return data.map((row: Record<string, unknown>) => ({
    ...(row as unknown as WeeklyBudget),
    items: (row.budget_items as unknown as BudgetItem[]) ?? [],
  }));
}

async function dbGetPettyCash(): Promise<PettyCashTransaction[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('petty_cash_transactions')
    .select('*')
    .order('transaction_date', { ascending: false });
  return (data as PettyCashTransaction[]) ?? [];
}

async function dbGetStaffAllowances(): Promise<StaffAllowance[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('staff_allowances')
    .select('*')
    .order('period_start', { ascending: false });
  return (data as StaffAllowance[]) ?? [];
}

async function dbGetTrainingAllocations(): Promise<TrainingAllocation[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('training_allocations')
    .select('*')
    .order('training_date', { ascending: false });
  return (data as TrainingAllocation[]) ?? [];
}

async function dbGetNewsArticles(): Promise<NewsArticle[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('news_articles')
    .select('*')
    .order('published_at', { ascending: false });
  return (data as NewsArticle[]) ?? [];
}

async function dbGetNewsArticle(id: string): Promise<NewsArticle | null> {
  const supabase = await createClient();
  const { data } = await supabase.from('news_articles').select('*').eq('id', id).maybeSingle();
  return (data as NewsArticle | null) ?? null;
}

async function dbGetMediaItems(): Promise<MediaItem[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('media_items')
    .select('*')
    .order('published_at', { ascending: false });
  return (data as MediaItem[]) ?? [];
}

async function dbGetStoreProducts(): Promise<StoreProduct[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('store_products')
    .select('*')
    .order('sort_order', { ascending: true });
  return (data as StoreProduct[]) ?? [];
}

async function dbGetStoreOrders(): Promise<StoreOrder[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('store_orders')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as StoreOrder[]) ?? [];
}

async function dbGetFanPolls(): Promise<FanPoll[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('fan_polls')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as FanPoll[]) ?? [];
}

async function dbGetFanNotifications(): Promise<FanNotification[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('fan_notifications')
    .select('*')
    .order('published_at', { ascending: false });
  return (data as FanNotification[]) ?? [];
}

async function dbGetPollResults(pollId: string): Promise<PollVoteRow[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc('get_poll_results', { p_poll_id: pollId });
  return (data as PollVoteRow[]) ?? [];
}

async function dbGetTicketAllocations(): Promise<TicketAllocation[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('ticket_allocations')
    .select('*, fixtures(home_team, away_team, match_date)')
    .order('created_at', { ascending: false });
  if (!data) return [];
  return data.map((row: Record<string, unknown>) => {
    const fixture = row.fixtures as {
      home_team: string;
      away_team: string;
      match_date: string;
    } | null;
    return {
      ...(row as unknown as TicketAllocation),
      home_team: fixture?.home_team ?? null,
      away_team: fixture?.away_team ?? null,
      match_date: fixture?.match_date ?? null,
      fixture_name:
        fixture ? `${fixture.home_team} vs ${fixture.away_team}` : 'General admission',
    };
  }) as TicketAllocation[];
}

async function dbGetTicketBookings(): Promise<TicketBooking[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('ticket_bookings')
    .select('*')
    .order('booking_date', { ascending: false });
  return (data as TicketBooking[]) ?? [];
}

async function dbGetMemberships(): Promise<Membership[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('memberships')
    .select('*')
    .order('joined_at', { ascending: false });
  return (data as Membership[]) ?? [];
}

async function dbGetAnnouncements(): Promise<Announcement[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('announcements')
    .select('*')
    .eq('enabled', true)
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: false });
  return (data as Announcement[]) ?? [];
}

async function dbGetSponsors(): Promise<Sponsor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('sponsors')
    .select('*')
    .eq('enabled', true)
    .order('sort_order')
    .order('name');
  return (data as Sponsor[]) ?? [];
}

async function dbGetSiteSettings(): Promise<SiteSettings> {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('key, value');
  const defaults: SiteSettings = {
    contact_email: null,
    contact_phone: null,
    contact_address: null,
    stadium_name: null,
    ticket_office: null,
    facebook: null,
    instagram: null,
    x_handle: null,
    tiktok: null,
    about_blurb: null,
    payment_to_mpamba: null,
    payment_to_airtel: null,
    payment_instructions: null,
  };
  if (!data) return defaults;
  for (const row of data) {
    const key = row.key as keyof SiteSettings;
    if (key in defaults) defaults[key] = row.value;
  }
  return defaults;
}

async function dbGetContactMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as ContactMessage[]) ?? [];
}

async function dbGetPaymentTransactions(): Promise<PaymentTransaction[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from('payment_transactions')
    .select('*')
    .order('created_at', { ascending: false });
  return (data as PaymentTransaction[]) ?? [];
}

/* ------------------------------------------------------------------ */
/*  Public API — tries Supabase, falls back to in-memory seed          */
/* ------------------------------------------------------------------ */

export async function getTeams(): Promise<Team[]> {
  if (!supabaseConfigured()) return SEED_TEAMS;
  return dbGetTeams();
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  if (!supabaseConfigured()) return SEED_TEAMS.find((t) => t.slug === slug) ?? null;
  return dbGetTeamBySlug(slug);
}

export async function getPlayers(teamId: string): Promise<Player[]> {
  if (!supabaseConfigured()) return SEED_PLAYERS.filter((p) => p.team_id === teamId);
  return dbGetPlayers(teamId);
}

export async function getPlayer(playerId: string): Promise<Player | null> {
  if (!supabaseConfigured()) return SEED_PLAYERS.find((p) => p.id === playerId) ?? null;
  return dbGetPlayer(playerId);
}

export async function getStandings(): Promise<Standing[]> {
  if (!supabaseConfigured()) return SEED_STANDINGS;
  return dbGetStandings();
}

export async function getFixtures(teamId: string): Promise<Fixture[]> {
  if (!supabaseConfigured()) return SEED_FIXTURES.filter((f) => f.team_id === teamId);
  return dbGetFixtures(teamId);
}

export async function getResults(teamId: string): Promise<Result[]> {
  if (!supabaseConfigured()) return SEED_RESULTS.filter((r) => r.team_id === teamId);
  return dbGetResults(teamId);
}

export async function getPerformance(): Promise<Performance[]> {
  if (!supabaseConfigured()) return SEED_PERFORMANCE;
  return dbGetPerformance();
}

export async function getCompetitions(): Promise<Competition[]> {
  if (!supabaseConfigured()) return SEED_COMPETITIONS;
  return dbGetCompetitions();
}

export async function getRegistrations(): Promise<Registration[]> {
  if (!supabaseConfigured()) return SEED_REGISTRATIONS;
  return dbGetRegistrations();
}

export async function getTransfers(): Promise<Transfer[]> {
  if (!supabaseConfigured()) return SEED_TRANSFERS;
  return dbGetTransfers();
}

export async function getWeeklyBudgets(): Promise<WeeklyBudget[]> {
  if (!supabaseConfigured()) return SEED_WEEKLY_BUDGETS;
  return dbGetWeeklyBudgets();
}

export async function getPettyCashTransactions(): Promise<PettyCashTransaction[]> {
  if (!supabaseConfigured()) return SEED_PETTY_CASH;
  return dbGetPettyCash();
}

export async function getStaffAllowances(): Promise<StaffAllowance[]> {
  if (!supabaseConfigured()) return SEED_STAFF_ALLOWANCES;
  return dbGetStaffAllowances();
}

export async function getTrainingAllocations(): Promise<TrainingAllocation[]> {
  if (!supabaseConfigured()) return SEED_TRAINING_ALLOCATIONS;
  return dbGetTrainingAllocations();
}

export async function getNewsArticles(): Promise<NewsArticle[]> {
  if (!supabaseConfigured()) return SEED_NEWS_ARTICLES;
  return dbGetNewsArticles();
}

export async function getNewsArticle(id: string): Promise<NewsArticle | null> {
  if (!supabaseConfigured()) {
    return SEED_NEWS_ARTICLES.find((a) => a.id === id) ?? null;
  }
  return dbGetNewsArticle(id);
}

export async function getMediaItems(): Promise<MediaItem[]> {
  if (!supabaseConfigured()) return SEED_MEDIA_ITEMS;
  return dbGetMediaItems();
}

export async function getStoreProducts(): Promise<StoreProduct[]> {
  // Staff-managed catalogue: starts empty, entered through /admin/store.
  if (!supabaseConfigured()) return [];
  return dbGetStoreProducts();
}

export async function getStoreOrders(): Promise<StoreOrder[]> {
  if (!supabaseConfigured()) return [];
  return dbGetStoreOrders();
}

export async function getFanPolls(): Promise<FanPoll[]> {
  // Staff-authored engagement polls: starts empty until published via /admin/polls.
  if (!supabaseConfigured()) return [];
  return dbGetFanPolls();
}

export async function getFanNotifications(): Promise<FanNotification[]> {
  if (!supabaseConfigured()) return [];
  return dbGetFanNotifications();
}

export async function getPollResults(pollId: string): Promise<PollVoteRow[]> {
  if (!supabaseConfigured()) return [];
  try {
    return await dbGetPollResults(pollId);
  } catch {
    return [];
  }
}

export async function getTicketAllocations(): Promise<TicketAllocation[]> {
  if (!supabaseConfigured()) return SEED_TICKET_ALLOCATIONS;
  return dbGetTicketAllocations();
}

export async function getTicketBookings(): Promise<TicketBooking[]> {
  if (!supabaseConfigured()) return SEED_TICKET_BOOKINGS;
  return dbGetTicketBookings();
}

export async function getMemberships(): Promise<Membership[]> {
  if (!supabaseConfigured()) return SEED_MEMBERSHIPS;
  return dbGetMemberships();
}

export async function getAnnouncements(): Promise<Announcement[]> {
  if (!supabaseConfigured()) return SEED_ANNOUNCEMENTS;
  return dbGetAnnouncements();
}

export async function getSponsors(): Promise<Sponsor[]> {
  if (!supabaseConfigured()) return SEED_SPONSORS;
  return dbGetSponsors();
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (!supabaseConfigured()) return SEED_SITE_SETTINGS;
  return dbGetSiteSettings();
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  if (!supabaseConfigured()) return SEED_CONTACT_MESSAGES;
  return dbGetContactMessages();
}

export async function getPaymentTransactions(): Promise<PaymentTransaction[]> {
  // Payments start empty; staff reconcile them in the admin Payments module.
  if (!supabaseConfigured()) return [];
  return dbGetPaymentTransactions();
}

/**
 * Most recent diagnostic events (errors/warnings) for the admin dashboard.
 * Reads go through the signed-in staff session (RLS authenticated read on
 * app_events). Returns an empty list when observability isn't wired yet so the
 * dashboard never breaks.
 */
export async function getRecentAppEvents(limit = 12): Promise<AppEvent[]> {
  if (!supabaseConfigured()) return [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('app_events')
      .select('id, level, scope, message, stack, data, path, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) return [];
    return (data ?? []) as unknown as AppEvent[];
  } catch {
    return [];
  }
}
