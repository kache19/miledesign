import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const runtimeConfig = typeof window !== 'undefined' ? window.__RUNTIME_CONFIG__ : undefined;
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || runtimeConfig?.SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || runtimeConfig?.SUPABASE_ANON_KEY || '';

export const missingSupabaseConfigMessage =
  'Missing Supabase configuration. Set VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY or public/runtime-config.js values.';

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      })
    : null;
