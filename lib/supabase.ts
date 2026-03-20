import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let supabaseClient: any = null;

// Only create client if both URL and key are available
if (supabaseUrl && supabaseAnonKey) {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Dummy client that won't crash but will fail gracefully
  supabaseClient = {
    from: () => ({
      select: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      insert: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      update: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
      delete: () => Promise.resolve({ data: null, error: { message: 'Supabase not configured' } }),
    })
  };
}

// Export both - use same client for all operations
export const supabase = supabaseClient;
export const supabaseAdmin = supabaseClient;

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
