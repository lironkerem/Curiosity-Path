/**
 * Supabase Client Configuration - Non-Vite Version
 * 
 * IMPORTANT: Without a build tool like Vite, environment variables
 * are NOT available in client-side JavaScript for security reasons.
 * 
 * OPTIONS:
 * 
 * 1. CURRENT APPROACH (SAFE & RECOMMENDED):
 *    - Keep hardcoded values in this file
 *    - Anon keys are PUBLIC by design (safe to expose)
 *    - RLS policies protect your data
 * 
 * 2. FUTURE APPROACH (when you add Vite/Webpack):
 *    - Move to environment variables
 *    - Use build-time replacement
 * 
 * WHY THIS IS SAFE:
 * - Supabase anon keys are designed to be public
 * - Row Level Security (RLS) protects data at database level
 * - Users can only access their own data via RLS policies
 * - Service role keys (SECRET) are never in client code
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

/* =========================================================
   CONFIGURATION
   ========================================================= */

// These values are SAFE to be public (anon key is designed for client-side use)
const SUPABASE_URL = 'https://qfbarhxfmzpgbgkaymuk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk';

/* =========================================================
   CLIENT OPTIONS
   ========================================================= */

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
      'x-app-name': 'digital-curiosity',
      'x-app-version': '1.0.0'
    }
  },
  // Realtime options
  realtime: {
    timeout: 10000
  }
};

/* =========================================================
   CLIENT INITIALIZATION
   ========================================================= */

let supabaseClient = null;

try {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);
  console.log('✅ Supabase client initialized');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error);
}

/**
 * Supabase client instance
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = supabaseClient;

/* =========================================================
   HELPER FUNCTIONS
   ========================================================= */

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

/* =========================================================
   DEVELOPMENT UTILITIES
   ========================================================= */

// Expose client info in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.__supabase = {
    client: supabaseClient,
    url: SUPABASE_URL,
    version: '2.39.0',
    test: testConnection,
    getCurrentUser,
    isAuthenticated,
    signOut
  };
  console.log('🔧 Supabase utilities available at window.__supabase');
  console.log('   Try: await window.__supabase.test()');
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default supabase;