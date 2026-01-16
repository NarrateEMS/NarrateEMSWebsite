import { createClient, SupabaseClient } from '@supabase/supabase-js'

// These environment variables need to be set in your Vercel project settings
// NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a single supabase client for interacting with your database
// Only create if we have the required env vars (prevents build-time errors)
let supabase: SupabaseClient

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // Important for handling invite tokens in URL hash
    },
  })
} else {
  // Placeholder client for build time - will be replaced at runtime
  supabase = {} as SupabaseClient
}

export { supabase }

