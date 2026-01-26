/**
 * Supabase Client Configuration
 * 
 * Provides configured Supabase client for database operations.
 * 
 * Tables used:
 * - user_data: Stores all app data (gratitude, journal, energy, etc.)
 * 
 * Environment Variables (optional):
 * - SUPABASE_URL: Override default URL
 * - SUPABASE_ANON_KEY: Override default anon key
 * 
 * Security Notes:
 * - Anon key is safe to expose (public by design)
 * - Row Level Security (RLS) policies protect data
 * - Users can only access their own data
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

/* --------------------------------------------------
   CONFIGURATION
   -------------------------------------------------- */

// Default credentials (can be overridden by environment)
const DEFAULT_SUPABASE_URL = 'https://qfbarhxfmzpgbgkaymuk.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk';

// Allow environment override (for testing/staging)
const SUPABASE_URL = typeof process !== 'undefined' && process.env?.SUPABASE_URL 
  ? process.env.SUPABASE_URL 
  : DEFAULT_SUPABASE_URL;

const SUPABASE_ANON_KEY = typeof process !== 'undefined' && process.env?.SUPABASE_ANON_KEY 
  ? process.env.SUPABASE_ANON_KEY 
  : DEFAULT_SUPABASE_ANON_KEY;

/* --------------------------------------------------
   CLIENT OPTIONS
   -------------------------------------------------- */

const options = {
  auth: {
    // Persist auth state in localStorage
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  // Global fetch options
  global: {
    headers: {
      'x-app-name': 'digital-curiosity'
    }
  },
  // Realtime options (if needed in future)
  realtime: {
    timeout: 10000
  }
};

/* --------------------------------------------------
   CLIENT INITIALIZATION
   -------------------------------------------------- */

let supabaseClient = null;

try {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  console.error('URL:', SUPABASE_URL);
  console.error('Check that Supabase credentials are valid and CDN is accessible');
}

/**
 * Supabase client instance
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = supabaseClient;

/* --------------------------------------------------
   HELPER FUNCTIONS
   -------------------------------------------------- */

/**
 * Check if Supabase client is initialized and ready
 * @returns {boolean} True if client is ready
 */
export function isSupabaseReady() {
  if (!supabaseClient) {
    console.error('Supabase client not initialized');
    return false;
  }
  return true;
}

/**
 * Get current authenticated user
 * @returns {Promise<Object|null>} User object or null
 */
export async function getCurrentUser() {
  if (!isSupabaseReady()) return null;
  
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user is authenticated
 * @returns {Promise<boolean>} True if authenticated
 */
export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

/**
 * Sign out current user
 * @returns {Promise<boolean>} True if successful
 */
export async function signOut() {
  if (!isSupabaseReady()) return false;
  
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error signing out:', error);
    return false;
  }
}

/**
 * Test database connection
 * @returns {Promise<boolean>} True if connection successful
 */
export async function testConnection() {
  if (!isSupabaseReady()) return false;
  
  try {
    const { error } = await supabaseClient.from('user_data').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows (but connection works)
      throw error;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

/* --------------------------------------------------
   DEVELOPMENT UTILITIES
   -------------------------------------------------- */

// Expose client info in development
if (typeof window !== 'undefined' && import.meta.url.includes('localhost')) {
  window.__supabase = {
    client: supabaseClient,
    url: SUPABASE_URL,
    version: '2.39.0',
    testConnection
  };
  console.log('🔧 Supabase client available at window.__supabase');
}