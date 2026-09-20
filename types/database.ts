/**
 * Database types for Ekhaya App.
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
          number: number | null;
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
      registrations: {
        Row: {
          id: string;
          team_id: string;
          player_name: string;
          position: string | null;
          date_of_birth: string | null;
          registration_date: string;
          fee_amount: number | null;
          status: 'pending' | 'approved' | 'rejected';
          notes: string | null;
          created_at: string;
        };
      };
      transfers: {
        Row: {
          id: string;
          team_id: string;
          player_name: string;
          transfer_type: 'in' | 'out';
          other_club: string;
          transfer_date: string;
          fee_amount: number | null;
          status: 'pending' | 'completed' | 'cancelled';
          notes: string | null;
          created_at: string;
        };
      };
      weekly_budgets: {
        Row: {
          id: string;
          week_start: string;
          week_end: string;
          status: 'draft' | 'approved' | 'paid';
          notes: string | null;
          created_at: string;
        };
      };
      budget_items: {
        Row: {
          id: string;
          budget_id: string;
          category: string;
          description: string | null;
          planned_amount: number | null;
          actual_amount: number | null;
          created_at: string;
        };
      };
      petty_cash_transactions: {
        Row: {
          id: string;
          transaction_date: string;
          transaction_type: 'in' | 'out';
          description: string;
          amount: number | null;
          category: string | null;
          requestor: string | null;
          approved_by: string | null;
          notes: string | null;
          created_at: string;
        };
      };
      staff_allowances: {
        Row: {
          id: string;
          team_id: string | null;
          staff_name: string;
          role: string | null;
          period_start: string;
          period_end: string;
          amount: number | null;
          status: 'pending' | 'paid';
          notes: string | null;
          created_at: string;
        };
      };
      training_allocations: {
        Row: {
          id: string;
          team_id: string;
          training_date: string;
          location: string | null;
          session_type: string | null;
          description: string | null;
          players_invited: number | null;
          budget_amount: number | null;
          status: 'scheduled' | 'completed' | 'cancelled';
          created_at: string;
        };
      };
      announcements: {
        Row: {
          id: string;
          title: string;
          body: string | null;
          type: string;
          published_at: string;
          is_pinned: boolean;
          enabled: boolean;
          created_at: string;
        };
      };
      sponsors: {
        Row: {
          id: string;
          name: string;
          level: string;
          website: string | null;
          logo_url: string | null;
          description: string | null;
          sort_order: number;
          enabled: boolean;
          created_at: string;
        };
      };
      site_settings: {
        Row: {
          key: string;
          value: string | null;
          updated_at: string;
        };
      };
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          status: 'new' | 'read' | 'archived';
          created_at: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      book_tickets: {
        Args: {
          p_allocation_id: string;
          p_full_name: string;
          p_email: string;
          p_phone: string | null;
          p_quantity: number;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
  };
}
