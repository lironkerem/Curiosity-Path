/**
 * supabase-client.js - Community Hub
 * Reuses the main app's already-authenticated Supabase client.
 * The main app exposes it via window.AppSupabase (set in /src/Core/Supabase.js).
 *
 * NOTE: window.AppSupabase may not be set at module parse time (timing race).
 * CommunityDB.init() reads window.AppSupabase directly at call time — after
 * auth is confirmed — so the value captured here is only used as a fallback.
 */

const CommunitySupabase = window.AppSupabase || null;

export { CommunitySupabase };

window.CommunitySupabase = CommunitySupabase;
