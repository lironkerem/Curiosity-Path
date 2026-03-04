/**
 * supabase-client.js - Community Hub
 * Reuses the main app's already-authenticated Supabase client.
 * The main app exposes it via window.AppSupabase (set in /Core/Supabase.js).
 */

window.CommunitySupabase = window.AppSupabase || null;

if (!window.CommunitySupabase) {
  console.error('[CommunityHub] window.AppSupabase not found. ' +
    'Make sure window.AppSupabase = supabaseClient is set in /Core/Supabase.js');
} else {
  console.log('✅ [CommunityHub] Supabase client ready');
}