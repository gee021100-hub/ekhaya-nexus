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
