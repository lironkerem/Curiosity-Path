/**
 * Supabase Client Configuration - Future-Proof Version
 * 
 * WORKS NOW (without Vite):
 * - Uses hardcoded values
 * - Safe and functional
 * 
 * WORKS LATER (with Vite):
 * - Automatically uses environment variables if available
 * - Falls back to hardcoded values if not
 * - Zero code changes needed when migrating to Vite
 * 
 * MIGRATION STEPS (when you add Vite):
 * 1. Install Vite: npm install vite
 * 2. Create .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
 * 3. Add to Vercel: Same variables
 * 4. This file works automatically - no changes needed!
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.39.0/+esm';

/* =========================================================
   CONFIGURATION - FUTURE-PROOF
   ========================================================= */

// ⚙️ ENVIRONMENT SWITCH — set to false before deploying to production
const DEV_MODE = true;

const SUPABASE_CONFIGS = {
  dev: {
    url:     'https://caayiswyoynmeuimvwyn.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYXlpc3d5b3lubWV1aW12d3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTUzNjksImV4cCI6MjA4NjY3MTM2OX0.AZ0btubjs18KMXlrTFlPKqBwSOV8t7KTrbiLo3XxoQ0'
  },
  prod: {
    url:     'https://qfbarhxfmzpgbgkaymuk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk'
  }
};

/**
 * Get Supabase URL - checks Vite env first, then DEV_MODE config
 */
function getSupabaseUrl() {
  if (typeof import.meta?.env?.VITE_SUPABASE_URL !== 'undefined') {
    console.log('✅ Using Supabase URL from environment variable');
    return import.meta.env.VITE_SUPABASE_URL;
  }
  const env = DEV_MODE ? 'dev' : 'prod';
  console.log(`✅ Using Supabase URL: ${env}`);
  return SUPABASE_CONFIGS[env].url;
}

/**
 * Get Supabase anon key - checks Vite env first, then DEV_MODE config
 */
function getSupabaseAnonKey() {
  if (typeof import.meta?.env?.VITE_SUPABASE_ANON_KEY !== 'undefined') {
    console.log('✅ Using Supabase anon key from environment variable');
    return import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
  return SUPABASE_CONFIGS[DEV_MODE ? 'dev' : 'prod'].anonKey;
}

const SUPABASE_URL = getSupabaseUrl();
const SUPABASE_ANON_KEY = getSupabaseAnonKey();

/* =========================================================
   CLIENT OPTIONS
   ========================================================= */

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  global: {
    headers: {
      'x-app-name': 'digital-curiosity',
      'x-app-version': '1.0.0'
    }
  },
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

// Expose globally so Community Hub can reuse the same authenticated session
if (typeof window !== 'undefined') {
  window.AppSupabase = supabaseClient;
}
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
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection failed:', error);
    return false;
  }
}

/**
 * Get configuration info (for debugging)
 * @returns {Object} Config details
 */
export function getConfig() {
  const isUsingEnv = typeof import.meta?.env?.VITE_SUPABASE_URL !== 'undefined';
  
  return {
    url: SUPABASE_URL,
    usingEnvironmentVariables: isUsingEnv,
    source: isUsingEnv ? 'Vite environment' : 'hardcoded fallback',
    buildTool: isUsingEnv ? 'Vite' : 'None',
    initialized: !!supabaseClient
  };
}

/* =========================================================
   DEVELOPMENT UTILITIES
   ========================================================= */

// Expose utilities in development
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.__supabase = {
    client: supabaseClient,
    config: getConfig(),
    test: testConnection,
    getCurrentUser,
    isAuthenticated,
    signOut,
    url: SUPABASE_URL,
    version: '2.39.0'
  };
  console.log('🔧 Supabase utilities available at window.__supabase');
  console.log('   Config:', getConfig());
}

/* =========================================================
   EXPORTS
   ========================================================= */

export default supabase;