/**
 * Supabase Client Configuration
 *
 * Reads credentials from Vite environment variables (VITE_SUPABASE_URL,
 * VITE_SUPABASE_ANON_KEY). Falls back to values injected at build time via
 * the constants below — update these before deploying if not using Vite.
 *
 * Migration to Vite:
 *   1. npm install vite
 *   2. Create .env:  VITE_SUPABASE_URL=...  VITE_SUPABASE_ANON_KEY=...
 *   3. Add same vars to Vercel environment settings
 *   4. No code changes needed — this file picks them up automatically.
 *
 * ⚠️  SECURITY NOTE:
 *   Supabase anon keys are intentionally public (they enforce Row-Level
 *   Security server-side). Never commit service-role keys here.
 */

import { createClient } from '@supabase/supabase-js';

// ─── Credential resolution ────────────────────────────────────────────────────

// DEV_MODE: set to true only during local development against the dev project.
// ⚙️  Set to false before every production deploy.
const DEV_MODE = false;

// Fallback credentials (anon/public keys — safe to ship in client code).
const FALLBACK = {
  dev: {
    url:     'https://caayiswyoynmeuimvwyn.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhYXlpc3d5b3lubWV1aW12d3luIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwOTUzNjksImV4cCI6MjA4NjY3MTM2OX0.AZ0btubjs18KMXlrTFlPKqBwSOV8t7KTrbiLo3XxoQ0'
  },
  prod: {
    url:     'https://qfbarhxfmzpgbgkaymuk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFmYmFyaHhmbXpwZ2Jna2F5bXVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1ODg4MjEsImV4cCI6MjA4MDE2NDgyMX0.twBWw0dZnLRTWTHav0sJ77GXyvsGR3ZgPplRO2vVSFk'
  }
};

function resolveUrl() {
  try { if (import.meta?.env?.VITE_SUPABASE_URL) return import.meta.env.VITE_SUPABASE_URL; } catch { /* no Vite */ }
  return FALLBACK[DEV_MODE ? 'dev' : 'prod'].url;
}

function resolveKey() {
  try { if (import.meta?.env?.VITE_SUPABASE_ANON_KEY) return import.meta.env.VITE_SUPABASE_ANON_KEY; } catch { /* no Vite */ }
  return FALLBACK[DEV_MODE ? 'dev' : 'prod'].anonKey;
}

const SUPABASE_URL      = resolveUrl();
const SUPABASE_ANON_KEY = resolveKey();

// ─── Client options ───────────────────────────────────────────────────────────

const CLIENT_OPTIONS = {
  auth: {
    autoRefreshToken:   true,
    persistSession:     true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined
  },
  global: {
    headers: {
      'x-app-name':    'digital-curiosity',
      'x-app-version': '1.0.0'
    }
  },
  realtime: {
    timeout: 10_000
  }
};

// ─── Client initialisation ────────────────────────────────────────────────────

let supabaseClient = null;

try {
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, CLIENT_OPTIONS);
} catch (error) {
  console.error('[Supabase] Failed to initialise client:', error);
}

/** @type {import('@supabase/supabase-js').SupabaseClient} */
export const supabase = supabaseClient;

// Expose globally so Community Hub can reuse the same authenticated session
if (typeof window !== 'undefined') {
  window.AppSupabase = supabaseClient;
}

// ─── Helper functions ─────────────────────────────────────────────────────────

/** @returns {boolean} True if client is ready */
export function isSupabaseReady() {
  if (!supabaseClient) { console.error('[Supabase] Client not initialised'); return false; }
  return true;
}

/** @returns {Promise<Object|null>} Authenticated user or null */
export async function getCurrentUser() {
  if (!isSupabaseReady()) return null;
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('[Supabase] getCurrentUser failed:', error);
    return null;
  }
}

/** @returns {Promise<boolean>} */
export async function isAuthenticated() {
  return !!(await getCurrentUser());
}

/** @returns {Promise<boolean>} True if sign-out succeeded */
export async function signOut() {
  if (!isSupabaseReady()) return false;
  try {
    const { error } = await supabaseClient.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('[Supabase] signOut failed:', error);
    return false;
  }
}

/** @returns {Promise<boolean>} True if connection is healthy */
export async function testConnection() {
  if (!isSupabaseReady()) return false;
  try {
    const { error } = await supabaseClient
      .from('user_data')
      .select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') throw error;
    return true;
  } catch (error) {
    console.error('[Supabase] Connection test failed:', error);
    return false;
  }
}

/** Returns config info — for debugging only, never expose to users. */
export function getConfig() {
  let usingEnv = false;
  try { usingEnv = !!import.meta?.env?.VITE_SUPABASE_URL; } catch { /* no Vite */ }
  return {
    url:                       SUPABASE_URL,
    usingEnvironmentVariables: usingEnv,
    source:                    usingEnv ? 'Vite environment' : 'hardcoded fallback',
    initialized:               !!supabaseClient
  };
}

// ─── Dev utilities ────────────────────────────────────────────────────────────
if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  window.__supabase = {
    client: supabaseClient,
    config: getConfig(),
    test:   testConnection,
    getCurrentUser,
    isAuthenticated,
    signOut,
    url:    SUPABASE_URL
  };
}

export default supabase;
