import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Client for public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for server-side operations (with service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types for database tables
export interface Guide {
  id: string;
  title: string;
  slug: string;
  category: 'class' | 'item' | 'reputation' | 'farming' | 'enhancement';
  description: string;
  sections: Section[];
  published: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
}

export interface Section {
  id: string;
  type: 'overview' | 'requirements' | 'step' | 'preview' | 'tips' | 'notes';
  title: string;
  content: string;
  order: number;
  data?: Record<string, any>; // For structured data like requirements
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'game_update' | 'event' | 'maintenance';
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface SiteUpdate {
  id: string;
  version: string;
  title: string;
  changes: string[]; // Array of change descriptions
  created_at: string;
}

export interface DiscordSubmission {
  id: string;
  user_id: string;
  username: string;
  message: string;
  message_link: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface UserFeedback {
  id: string;
  guide_id: string;
  user_name: string;
  user_email?: string;
  rating: number;
  comment: string;
  helpful_count: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  discord_id: string;
  username: string;
  role: 'admin' | 'moderator';
  created_at: string;
}
