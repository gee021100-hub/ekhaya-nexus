import { createClient, supabaseConfigured } from '@/lib/supabase/server';
import type { Team, Player, Competition, Standing, Fixture, Result, Performance } from '@/types';

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
  { id: 'c1000000-0000-0000-0000-000000000001', team_id: SENIOR_ID, name: 'Allen Chihana', strong_foot: null, age: null, position: null, goals: 6, assists: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000002', team_id: SENIOR_ID, name: 'Blessings Malinda', strong_foot: null, age: null, position: null, goals: 5, assists: 2, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000003', team_id: SENIOR_ID, name: 'Chimwemwe Chunga', strong_foot: null, age: null, position: null, goals: 4, assists: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000004', team_id: SENIOR_ID, name: 'James Lumbe', strong_foot: null, age: null, position: null, goals: 2, assists: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000005', team_id: SENIOR_ID, name: 'Levison Mnyenyembe', strong_foot: null, age: null, position: null, goals: 1, assists: 4, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000006', team_id: SENIOR_ID, name: 'James Stambuli', strong_foot: null, age: null, position: null, goals: 1, assists: 1, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000007', team_id: SENIOR_ID, name: 'Charles Mafaiti', strong_foot: null, age: null, position: null, goals: 1, assists: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000008', team_id: SENIOR_ID, name: 'Samuel Rukura', strong_foot: null, age: null, position: null, goals: null, assists: 2, created_at: '2026-01-01T00:00:00Z' },
  { id: 'c1000000-0000-0000-0000-000000000009', team_id: SENIOR_ID, name: 'Isaiah Nyirenda', strong_foot: null, age: null, position: null, goals: null, assists: 2, created_at: '2026-01-01T00:00:00Z' },
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
  { id: 'f1000000-0000-0000-0000-000000000011', team_id: SENIOR_ID, home_team: 'Kamuzu Barracks', away_team: 'Ekhaya', home_score: 4, away_score: 1, match_date: '2026-05-23', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '2026-01-01T00:00:00Z' },
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
