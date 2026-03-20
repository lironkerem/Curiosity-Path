/**
 * DB.js - Database Layer
 * Handles user progress data persistence with Supabase.
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */

import { supabase } from './Supabase.js';

// ─── Constants ───────────────────────────────────────────────────────────────

const ERROR_CODES = { NO_ROWS: 'PGRST116' };

const CONFIG = {
  CACHE_TTL:         30_000, // 30 s
  MAX_RETRIES:       3,
  RETRY_DELAY_BASE:  1_000,
  MAX_PAYLOAD_BYTES: 5 * 1024 * 1024 // 5 MB guard
};

// ─── In-memory cache ─────────────────────────────────────────────────────────

let cachedPayload  = null;
let cacheTimestamp = 0;

// ─── Private helpers ─────────────────────────────────────────────────────────

async function getAuthenticatedUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(`Authentication error: ${error.message}`);
  if (!user) throw new Error('Not authenticated');
  return user;
}

async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) { console.error('[DB] Session error:', error); return null; }
  return session;
}

async function withRetry(fn, maxRetries = CONFIG.MAX_RETRIES) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLast = i === maxRetries - 1;
      const noRetry = (
        error.message.includes('authenticated') ||
        error.message.includes('Invalid payload') ||
        error.message.includes('Payload too large')
      );
      if (isLast || noRetry) throw error;
      const delay = CONFIG.RETRY_DELAY_BASE * (i + 1);
      console.warn(`[DB] Retry ${i + 1}/${maxRetries} in ${delay}ms`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

function isCacheValid() {
  return cachedPayload !== null && (Date.now() - cacheTimestamp) < CONFIG.CACHE_TTL;
}

function invalidateCache() {
  cachedPayload  = null;
  cacheTimestamp = 0;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Fetches the current user's progress data from the database.
 * Uses an in-memory TTL cache to reduce Supabase calls.
 *
 * @param {boolean} forceRefresh - Bypass the cache when true
 * @returns {Promise<Object|null>} Progress payload, {} for new users, null on error
 */
export async function fetchProgress(forceRefresh = false) {
  try {
    if (!forceRefresh && isCacheValid()) return cachedPayload;

    const session = await getSession();
    if (!session) {
      console.warn('[DB] No active session');
      invalidateCache();
      return null;
    }

    const result = await withRetry(async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('payload')
        .eq('user_id', session.user.id)
        .single();

      if (error) {
        if (error.code === ERROR_CODES.NO_ROWS) return {};
        throw new Error(`Database error: ${error.message}`);
      }

      // Validate shape before returning
      const p = data?.payload;
      if (p !== null && p !== undefined && (typeof p !== 'object' || Array.isArray(p))) {
        throw new Error('Invalid payload shape from database');
      }

      return p || {};
    });

    cachedPayload  = result;
    cacheTimestamp = Date.now();
    return result;

  } catch (error) {
    console.error('[DB] fetchProgress failed:', error);
    invalidateCache();
    return null;
  }
}

/**
 * Saves user progress to the database (upsert).
 * Validates and size-checks the payload before writing.
 *
 * @param {Object} payload
 * @throws {Error} If payload is invalid or save fails
 */
export async function saveProgress(payload) {
  try {
    // ── Input validation ──────────────────────────────────────────────────
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Invalid payload: must be a non-array object');
    }

    // Guard against accidental huge writes
    const serialized = JSON.stringify(payload);
    if (serialized.length > CONFIG.MAX_PAYLOAD_BYTES) {
      throw new Error(`Payload too large: ${(serialized.length / 1024).toFixed(0)} KB exceeds 5 MB limit`);
    }
    // ─────────────────────────────────────────────────────────────────────

    const user = await getAuthenticatedUser();

    await withRetry(async () => {
      const { error } = await supabase
        .from('user_progress')
        .upsert(
          { user_id: user.id, payload, updated_at: new Date().toISOString() },
          { onConflict: 'user_id' }
        );
      if (error) throw new Error(`Database save failed: ${error.message}`);
    });

    // Update cache optimistically
    cachedPayload  = payload;
    cacheTimestamp = Date.now();

  } catch (error) {
    console.error('[DB] saveProgress failed:', error);
    invalidateCache();
    throw error;
  }
}

/**
 * Invalidates the in-memory progress cache.
 * Call on logout or when switching users.
 */
export function clearCache() {
  invalidateCache();
}

/**
 * Returns cache diagnostic information (dev/debug use only).
 * @returns {{ isCached: boolean, isValid: boolean, age: number, ttl: number }}
 */
export function getCacheStats() {
  return {
    isCached: cachedPayload !== null,
    isValid:  isCacheValid(),
    age:      cachedPayload ? Date.now() - cacheTimestamp : 0,
    ttl:      CONFIG.CACHE_TTL
  };
}
