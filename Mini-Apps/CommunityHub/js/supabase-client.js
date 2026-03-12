/**
 * supabase-client.js - Community Hub
 * Reuses the main app's already-authenticated Supabase client.
 * The main app exposes it via window.AppSupabase (set in /Core/Supabase.js).
 */

const CommunitySupabase = window.AppSupabase || null;

if (!CommunitySupabase) {
  console.error('[CommunityHub] window.AppSupabase not found. ' +
    'Make sure window.AppSupabase = supabaseClient is set in /Core/Supabase.js');
} else {
}

// Named export for ES module consumers
export { CommunitySupabase };

// Keep window assignment for classic scripts that still reference window.CommunitySupabase
window.CommunitySupabase = CommunitySupabase;
