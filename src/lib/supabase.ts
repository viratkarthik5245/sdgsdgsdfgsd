import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface DatabaseProduct {
  id: string;
  name: string;
  description: string;
  usage_instructions: string;
  external_link: string;
  half?: 1 | 2; // Optional field
  created_at: string;
  updated_at: string;
}