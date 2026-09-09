import { createClient } from '@/lib/supabase/server';
import { supabaseConfigured } from '@/lib/supabase/server';
import type {
  Team,
  Player,
  Competition,
  Standing,
  Fixture,
  Result,
  Performance,
} from '@/types';

// Fallback seed data used when Supabase is not yet configured.
// Real seed data lives in supabase/seed/seed.sql.

const seedTeams: Team[] = [
  { id: 'a1000000-0000-0000-0000-000000000001', name: 'Senior Team', slug: 'senior', description: 'Ekhaya FC Senior Team', created_at: '' },
  { id: 'a1000000-0000-0000-0000-000000000002', name: "Women's Team", slug: 'women', description: "Ekhaya FC Women's Team", created_at: '' },
  { id: 'a1000000-0000-0000-0000-000000000003', name: 'Reserve Team', slug: 'reserve', description: 'Ekhaya FC Reserve Team', created_at: '' },
  { id: 'a1000000-0000-0000-0000-000000000004', name: 'Youth Team', slug: 'youth', description: 'Ekhaya FC Youth Team', created_at: '' },
];

const seedCompetitions: Competition[] = [
  { id: 'b1000000-0000-0000-0000-000000000001', name: 'FDH Championship', created_at: '' },
  { id: 'b1000000-0000-0000-0000-000000000002', name: 'Airtel Cup', created_at: '' },
  { id: 'b1000000-0000-0000-0000-000000000003', name: 'Castel Cup', created_at: '' },
];

const seedPlayers: Player[] = [
  { id: 'c1000000-0000-0000-0000-000000000001', team_id: 'a1000000-0000-0000-0000-000000000001', name: 'Allen Chihana', strong_foot: null, age: null, position: null, goals: 6, assists: 1, created_at: '' },
  { id: 'c1000000-0000-0000-0000-000000000002', team_id: 'a1000000-0000-0000-0000-000000000001', name: 'Blessings Malinda', strong_foot: null, age: null, position: null, goals: 5, assists: 2, created_at: '' },
  { id: 'c1000000-0000-0000-0000-000000000003', team_id: 'a1000000-0000-0000-0000-000000000001', name: 'Chimwemwe Chunga', strong_foot: null, age: null, position: null, goals: 4, assists: 1, created_at: '' },
  { id: 'c1000000-0000-0000-0000-000000000004', team_id: 'a1000000-0000-0000-0000-000000000001', name: 'James Lumbe', strong_foot: null, age: null, position: null, goals: 2, assists: 1, created_at: '' },
  { id: 'c1000000-0000-0000-0000-000000000005', team_id: 'a1000000-0000-0000-0000-000000000001', name: 'Levison Mnyenyembe', strong_foot: null, age: null, position: null, goals: 1, assists: 4, created_at: '' },
  { id: 'c1000000-0000-0000-0000-000000000006', team_id: 'a1000000-0000-0000-0000-000000000001', name: 'James Stambuli', strong_foot: null, age: null, position: null, goals: 1, assists: 1, created_at: '' },
  { id: 'c1000000-0000-0000-0000-000000000007', team_id: 'a1000000-0000-0000-0000-000000000001', name: 'Charles Mafaiti', strong_foot: null, age: null, position: null, goals: 1, assists: null, created_at: '' },
  { id: 'c1000000-0000-0000-0000-000000000008', team_id: 'a1000000-0000-0000-0000-000000000001', name: 'Samuel Rukura', strong_foot: null, age: null, position: null, goals: null, assists: 2, created_at: '' },
  { id: 'c1000000-0000-0000-0000-000000000009', team_id: 'a1000000-0000-0000-0000-000000000001', name: 'Isaiah Nyirenda', strong_foot: null, age: null, position: null, goals: null, assists: 2, created_at: '' },
];

const seedStandings: Standing[] = [
  { id: 's1', position: 1, team_name: 'Big Bullets', played: 15, wins: 8, draws: 6, losses: 1, goals_for: 20, goals_against: 7, goal_difference: 13, points: 30, created_at: '' },
  { id: 's2', position: 2, team_name: 'Mighty Wanderers', played: 14, wins: 8, draws: 5, losses: 1, goals_for: 26, goals_against: 9, goal_difference: 17, points: 29, created_at: '' },
  { id: 's3', position: 3, team_name: 'Silver Strikers', played: 15, wins: 8, draws: 5, losses: 2, goals_for: 23, goals_against: 10, goal_difference: 13, points: 29, created_at: '' },
  { id: 's4', position: 4, team_name: 'Blue Eagles', played: 14, wins: 9, draws: 1, losses: 4, goals_for: 22, goals_against: 15, goal_difference: 7, points: 28, created_at: '' },
  { id: 's5', position: 5, team_name: 'Masters FC', played: 15, wins: 6, draws: 4, losses: 5, goals_for: 17, goals_against: 16, goal_difference: 1, points: 22, created_at: '' },
  { id: 's6', position: 6, team_name: 'Moyale Barracks', played: 15, wins: 5, draws: 6, losses: 4, goals_for: 16, goals_against: 17, goal_difference: -1, points: 21, created_at: '' },
  { id: 's7', position: 7, team_name: 'Chitipa United', played: 15, wins: 6, draws: 3, losses: 6, goals_for: 11, goals_against: 16, goal_difference: -5, points: 21, created_at: '' },
  { id: 's8', position: 8, team_name: 'Red Lions', played: 15, wins: 5, draws: 5, losses: 5, goals_for: 12, goals_against: 13, goal_difference: -1, points: 20, created_at: '' },
  { id: 's9', position: 9, team_name: 'Civo Utd', played: 15, wins: 6, draws: 2, losses: 7, goals_for: 10, goals_against: 14, goal_difference: -4, points: 20, created_at: '' },
  { id: 's10', position: 10, team_name: 'Mitundu Baptist', played: 14, wins: 5, draws: 4, losses: 5, goals_for: 12, goals_against: 13, goal_difference: -1, points: 19, created_at: '' },
  { id: 's11', position: 11, team_name: 'Ekhaya', played: 15, wins: 4, draws: 6, losses: 5, goals_for: 15, goals_against: 14, goal_difference: 1, points: 18, created_at: '' },
  { id: 's12', position: 12, team_name: 'Karonga United', played: 15, wins: 3, draws: 5, losses: 7, goals_for: 14, goals_against: 23, goal_difference: -9, points: 14, created_at: '' },
  { id: 's13', position: 13, team_name: 'Dedza Dynamos', played: 14, wins: 3, draws: 5, losses: 6, goals_for: 9, goals_against: 19, goal_difference: -10, points: 14, created_at: '' },
  { id: 's14', position: 14, team_name: 'MAFCO', played: 15, wins: 3, draws: 4, losses: 8, goals_for: 12, goals_against: 17, goal_difference: -5, points: 13, created_at: '' },
  { id: 's15', position: 15, team_name: 'Kamuzu Barracks', played: 15, wins: 3, draws: 3, losses: 9, goals_for: 15, goals_against: 22, goal_difference: -7, points: 12, created_at: '' },
  { id: 's16', position: 16, team_name: 'Creck Sporting', played: 15, wins: 2, draws: 4, losses: 9, goals_for: 11, goals_against: 20, goal_difference: -9, points: 10, created_at: '' },
];

const seedFixtures: Fixture[] = [
  { id: 'f1', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Kamuzu Barracks', match_date: '2026-10-10', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f2', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Red Lions', away_team: 'Ekhaya', match_date: '2026-10-18', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f3', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Blue Eagles', match_date: '2026-10-25', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f4', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'MAFCO', away_team: 'Ekhaya', match_date: '2026-11-01', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f5', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Civo Utd', match_date: '2026-11-21', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f6', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Masters FC', away_team: 'Ekhaya', match_date: '2026-11-28', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f7', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Mighty Wanderers', match_date: '2026-12-06', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f8', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Moyale Barracks', away_team: 'Ekhaya', match_date: '2026-12-12', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f9', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Mitundu Baptist', match_date: '2026-12-19', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f10', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Big Bullets', away_team: 'Ekhaya', match_date: '2027-01-03', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f11', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Chitipa United', match_date: '2027-01-16', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f12', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Dedza Dynamos', away_team: 'Ekhaya', match_date: '2027-01-25', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f13', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Silver Strikers', match_date: '2027-01-31', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f14', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Creck Sporting', match_date: '2027-02-06', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'f15', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Karonga United', away_team: 'Ekhaya', match_date: '2027-02-20', match_time: null, competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
];

const seedResults: Result[] = [
  { id: 'r1', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Karonga United', home_score: 0, away_score: 0, match_date: '2026-09-06', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r2', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Creck Sporting', away_team: 'Ekhaya', home_score: 3, away_score: 2, match_date: '2026-08-22', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r3', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Silver Strikers', away_team: 'Ekhaya', home_score: 3, away_score: 0, match_date: '2026-08-15', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r4', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Dedza Dynamos', home_score: 1, away_score: 1, match_date: '2026-08-08', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r5', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Chitipa United', away_team: 'Ekhaya', home_score: 1, away_score: 0, match_date: '2026-07-25', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r6', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Big Bullets', home_score: 0, away_score: 0, match_date: '2026-07-19', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r7', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Mitundu Baptist', away_team: 'Ekhaya', home_score: 0, away_score: 0, match_date: '2026-07-05', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r8', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'MAFCO', home_score: 1, away_score: 0, match_date: '2026-06-28', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r9', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Mighty Wanderers', away_team: 'Ekhaya', home_score: 1, away_score: 1, match_date: '2026-06-20', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r10', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Masters FC', home_score: 2, away_score: 0, match_date: '2026-05-30', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r11', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Kamuzu Barracks', away_team: 'Ekhaya', home_score: 4, away_score: 1, match_date: '2026-05-23', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r12', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Moyale Barracks', home_score: 2, away_score: 0, match_date: '2026-05-16', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r13', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Civo Utd', away_team: 'Ekhaya', home_score: 1, away_score: 0, match_date: '2026-05-09', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r14', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Red Lions', home_score: 1, away_score: 1, match_date: '2026-05-02', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r15', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Blue Eagles', away_team: 'Ekhaya', home_score: 2, away_score: 1, match_date: '2026-04-26', match_time: '14:30:00', competition_id: 'b1000000-0000-0000-0000-000000000001', competition_name: 'FDH Championship', created_at: '' },
  { id: 'r16', team_id: 'a1000000-0000-0000-0000-000000000001', home_team: 'Ekhaya', away_team: 'Dedza Dynamos', home_score: 0, away_score: 2, match_date: '2027-01-24', match_time: '14:30:00', competition_id: null, competition_name: null, created_at: '' },
];

const seedPerformance: Performance[] = [
  { id: 'p1', player_id: 'c1000000-0000-0000-0000-000000000001', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 2, assists: 1, medical: null, minutes_played: null, player_name: 'Allen Chihana', competition_name: 'FDH Championship', created_at: '' },
  { id: 'p2', player_id: 'c1000000-0000-0000-0000-000000000002', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 4, assists: null, medical: null, minutes_played: null, player_name: 'Blessings Malinda', competition_name: 'FDH Championship', created_at: '' },
  { id: 'p3', player_id: 'c1000000-0000-0000-0000-000000000003', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 4, assists: null, medical: null, minutes_played: null, player_name: 'Chimwemwe Chunga', competition_name: 'FDH Championship', created_at: '' },
  { id: 'p4', player_id: 'c1000000-0000-0000-0000-000000000004', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 2, assists: null, medical: null, minutes_played: null, player_name: 'James Lumbe', competition_name: 'FDH Championship', created_at: '' },
  { id: 'p5', player_id: 'c1000000-0000-0000-0000-000000000005', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 1, assists: 4, medical: null, minutes_played: null, player_name: 'Levison Mnyenyembe', competition_name: 'FDH Championship', created_at: '' },
  { id: 'p6', player_id: 'c1000000-0000-0000-0000-000000000006', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 1, assists: 1, medical: null, minutes_played: null, player_name: 'James Stambuli', competition_name: 'FDH Championship', created_at: '' },
  { id: 'p7', player_id: 'c1000000-0000-0000-0000-000000000007', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: 1, assists: null, medical: null, minutes_played: null, player_name: 'Charles Mafaiti', competition_name: 'FDH Championship', created_at: '' },
  { id: 'p8', player_id: 'c1000000-0000-0000-0000-000000000008', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: null, assists: 2, medical: null, minutes_played: null, player_name: 'Samuel Rukura', competition_name: 'FDH Championship', created_at: '' },
  { id: 'p9', player_id: 'c1000000-0000-0000-0000-000000000009', competition_id: 'b1000000-0000-0000-0000-000000000001', goals: null, assists: 1, medical: null, minutes_played: null, player_name: 'Isaiah Nyirenda', competition_name: 'FDH Championship', created_at: '' },
  { id: 'p10', player_id: 'c1000000-0000-0000-0000-000000000001', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: 4, assists: null, medical: null, minutes_played: null, player_name: 'Allen Chihana', competition_name: 'Airtel Cup', created_at: '' },
  { id: 'p11', player_id: 'c1000000-0000-0000-0000-000000000002', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: null, assists: 2, medical: null, minutes_played: null, player_name: 'Blessings Malinda', competition_name: 'Airtel Cup', created_at: '' },
  { id: 'p12', player_id: 'c1000000-0000-0000-0000-000000000003', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: 1, assists: 1, medical: null, minutes_played: null, player_name: 'Chimwemwe Chunga', competition_name: 'Airtel Cup', created_at: '' },
  { id: 'p13', player_id: 'c1000000-0000-0000-0000-000000000004', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: null, assists: 1, medical: null, minutes_played: null, player_name: 'James Lumbe', competition_name: 'Airtel Cup', created_at: '' },
  { id: 'p14', player_id: 'c1000000-0000-0000-0000-000000000009', competition_id: 'b1000000-0000-0000-0000-000000000002', goals: null, assists: 1, medical: null, minutes_played: null, player_name: 'Isaiah Nyirenda', competition_name: 'Airtel Cup', created_at: '' },
];

export async function getTeams(): Promise<Team[]> {
  if (!supabaseConfigured()) return seedTeams;
  const supabase = await createClient();
  const { data } = await supabase.from('teams').select('*').order('name');
  return (data as Team[]) ?? [];
}

export async function getTeamBySlug(slug: string): Promise<Team | null> {
  if (!supabaseConfigured()) {
    return seedTeams.find((t) => t.slug === slug) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from('teams')
    .select('*')
    .eq('slug', slug)
    .single();
  return (data as Team) ?? null;
}

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  if (!supabaseConfigured()) {
    return seedPlayers.filter((p) => p.team_id === teamId);
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from('players')
    .select('*')
    .eq('team_id', teamId)
    .order('name');
  return (data as Player[]) ?? [];
}

export async function getPlayerById(playerId: string): Promise<Player | null> {
  if (!supabaseConfigured()) {
    return seedPlayers.find((p) => p.id === playerId) ?? null;
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from('players')
    .select('*')
    .eq('id', playerId)
    .single();
  return (data as Player) ?? null;
}

export async function getStandings(): Promise<Standing[]> {
  if (!supabaseConfigured()) return seedStandings;
  const supabase = await createClient();
  const { data } = await supabase
    .from('standings')
    .select('*')
    .order('position');
  return (data as Standing[]) ?? [];
}

export async function getFixturesByTeam(teamId: string): Promise<Fixture[]> {
  if (!supabaseConfigured()) {
    return seedFixtures.filter((f) => f.team_id === teamId);
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from('fixtures')
    .select('*, competitions(name)')
    .eq('team_id', teamId)
    .order('match_date');
  if (!data) return [];
  return data.map((row) => ({
    ...(row as unknown as Fixture),
    competition_name: (row.competitions as { name: string } | null)?.name ?? null,
  })) as Fixture[];
}

export async function getResultsByTeam(teamId: string): Promise<Result[]> {
  if (!supabaseConfigured()) {
    return seedResults.filter((r) => r.team_id === teamId);
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from('results')
    .select('*, competitions(name)')
    .eq('team_id', teamId)
    .order('match_date', { ascending: false });
  if (!data) return [];
  return data.map((row) => ({
    ...(row as unknown as Result),
    competition_name: (row.competitions as { name: string } | null)?.name ?? null,
  })) as Result[];
}

export async function getCompetitions(): Promise<Competition[]> {
  if (!supabaseConfigured()) return seedCompetitions;
  const supabase = await createClient();
  const { data } = await supabase
    .from('competitions')
    .select('*')
    .order('name');
  return (data as Competition[]) ?? [];
}

export async function getPerformanceByCompetition(
  competitionId: string,
): Promise<Performance[]> {
  if (!supabaseConfigured()) {
    return seedPerformance
      .filter((p) => p.competition_id === competitionId)
      .sort((a, b) => (b.goals ?? 0) - (a.goals ?? 0));
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from('performance')
    .select('*, players(name), competitions(name)')
    .eq('competition_id', competitionId)
    .order('goals', { ascending: false });
  if (!data) return [];
  return data.map((row) => ({
    ...(row as unknown as Performance),
    player_name: (row.players as { name: string } | null)?.name ?? null,
    competition_name: (row.competitions as { name: string } | null)?.name ?? null,
  })) as Performance[];
}

export async function getPerformanceByPlayer(
  playerId: string,
): Promise<Performance[]> {
  if (!supabaseConfigured()) {
    return seedPerformance.filter((p) => p.player_id === playerId);
  }
  const supabase = await createClient();
  const { data } = await supabase
    .from('performance')
    .select('*, competitions(name)')
    .eq('player_id', playerId)
    .order('goals', { ascending: false });
  if (!data) return [];
  return data.map((row) => ({
    ...(row as unknown as Performance),
    competition_name: (row.competitions as { name: string } | null)?.name ?? null,
  })) as Performance[];
}
