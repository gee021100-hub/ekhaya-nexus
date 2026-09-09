/**
 * Database types for Ekhaya Nexus.
 * Run `pnpm db:types` after connecting a database to regenerate.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
      };
      players: {
        Row: {
          id: string;
          team_id: string;
          name: string;
          strong_foot: string | null;
          age: number | null;
          position: string | null;
          goals: number | null;
          assists: number | null;
          created_at: string;
        };
      };
      competitions: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
      };
      standings: {
        Row: {
          id: string;
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
        };
      };
      fixtures: {
        Row: {
          id: string;
          team_id: string;
          home_team: string;
          away_team: string;
          match_date: string;
          match_time: string | null;
          competition_id: string | null;
          created_at: string;
        };
      };
      results: {
        Row: {
          id: string;
          team_id: string;
          home_team: string;
          away_team: string;
          home_score: number;
          away_score: number;
          match_date: string;
          match_time: string | null;
          competition_id: string | null;
          created_at: string;
        };
      };
      performance: {
        Row: {
          id: string;
          player_id: string;
          competition_id: string;
          goals: number | null;
          assists: number | null;
          medical: string | null;
          minutes_played: number | null;
          created_at: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
