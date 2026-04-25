/**
 * CommunityDB.js - Core-level re-export
 *
 * Re-exports CommunityDB from the CommunityHub data layer so that
 * Core modules (DashboardManager, ActiveMembersWidget, MemberProfileModal)
 * can import it without depending on any other CommunityHub file.
 *
 * CommunityDB itself uses window.AppSupabase at runtime (set by src/Core/Supabase.js
 * during bootstrap) — so there is no circular dependency and no eager loading
 * of CommunityHub JS chunks.
 */

export { CommunityDB } from '../Mini-Apps/CommunityHub/js/community-supabase.js';