/**
 * DB.js - Database Layer
 * Handles user progress data persistence with Supabase
 * @author Aanandoham (Liron Kerem)
 * @copyright 2026
 */

/* global window, console */

import { supabase } from './Supabase.js';

/** Error codes from Supabase */
const ERROR_CODES = {
  NO_ROWS: 'PGRST116'
};

/** Configuration */
const CONFIG = {
  CACHE_TTL: 30000, // 30 seconds cache lifetime
  MAX_RETRIES: 3,
  RETRY_DELAY_BASE: 1000 // Base delay for retry backoff
};

/** Simple cache for progress data */
let cachedPayload = null;
let cacheTimestamp = 0;

/* ---------- Helper Functions ---------- */

/**
 * Gets the currently authenticated user
 * @private
 * @returns {Promise<Object>} User object
 * @throws {Error} If not authenticated or auth fails
 */
async function getAuthenticatedUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    throw new Error(`Authentication error: ${error.message}`);
  }
  if (!user) {
    throw new Error('Not authenticated');
  }
  return user;
}

/**
 * Gets the current session
 * @private
 * @returns {Promise<Object|null>} Session object or null
 */
async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('[DB] Session error:', error);
    return null;
  }
  return session;
}

/**
 * Executes a function with retry logic for transient failures
 * @private
 * @param {Function} fn - Async function to execute
 * @param {number} maxRetries - Maximum retry attempts
 * @returns {Promise<*>} Result of the function
 */
async function withRetry(fn, maxRetries = CONFIG.MAX_RETRIES) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastAttempt = i === maxRetries - 1;
      
      // Don't retry auth errors or validation errors
      const shouldNotRetry = 
        error.message.includes('authenticated') ||
        error.message.includes('Invalid payload');
      
      if (isLastAttempt || shouldNotRetry) {
        throw error;
      }
      
      // Exponential backoff
      const delay = CONFIG.RETRY_DELAY_BASE * (i + 1);
      console.warn(`[DB] Retry attempt ${i + 1}/${maxRetries} after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Checks if cached data is still valid
 * @private
 * @returns {boolean} True if cache is valid
 */
function isCacheValid() {
  return cachedPayload !== null && 
         (Date.now() - cacheTimestamp) < CONFIG.CACHE_TTL;
}

/**
 * Invalidates the progress cache
 * @private
 */
function invalidateCache() {
  cachedPayload = null;
  cacheTimestamp = 0;
}

/* ---------- Public API ---------- */

/**
 * Fetches current user's progress data from database
 * Uses caching to reduce database calls
 * @public
 * @param {boolean} forceRefresh - Force bypass cache and fetch fresh data
 * @returns {Promise<Object|null>} Progress payload object, empty object for new users, or null on error
 */
export async function fetchProgress(forceRefresh = false) {
  try {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && isCacheValid()) {
      console.log('[DB] Returning cached progress');
      return cachedPayload;
    }

    // Check session
    const session = await getSession();
    if (!session) {
      console.warn('[DB] No active session');
      invalidateCache();
      return null;
    }

    // Fetch from database with retry logic
    const result = await withRetry(async () => {
      const { data, error } = await supabase
        .from('user_progress')
        .select('payload')
        .single();

      if (error) {
        // New user case - no row exists yet
        if (error.code === ERROR_CODES.NO_ROWS) {
          console.log('[DB] New user detected - returning empty payload');
          return {};
        }
        throw new Error(`Database error: ${error.message}`);
      }

      return data?.payload || {};
    });

    // Cache the result
    cachedPayload = result;
    cacheTimestamp = Date.now();
    
    console.log('[DB] Progress fetched successfully');
    return result;

  } catch (error) {
    console.error('[DB] Error in fetchProgress:', error);
    invalidateCache();
    return null;
  }
}

/**
 * Saves user progress data to database
 * Performs upsert operation (insert or update)
 * Invalidates cache after successful save
 * @public
 * @param {Object} payload - Progress data to save
 * @throws {Error} If payload is invalid, user not authenticated, or save fails
 */
export async function saveProgress(payload) {
  try {
    // Validate payload
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
      throw new Error('Invalid payload: must be a non-array object');
    }

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Save to database with retry logic
    await withRetry(async () => {
      const { error } = await supabase
        .from('user_progress')
        .upsert(
          { 
            user_id: user.id, 
            payload, 
            updated_at: new Date().toISOString() 
          }, 
          { onConflict: 'user_id' }
        );

      if (error) {
        throw new Error(`Database save failed: ${error.message}`);
      }
    });

    // Update cache with new data
    cachedPayload = payload;
    cacheTimestamp = Date.now();

    console.log('[DB] Progress saved successfully (cloud & cache)');

  } catch (error) {
    console.error('[DB] Error in saveProgress:', error);
    // Invalidate cache on save failure
    invalidateCache();
    throw error;
  }
}

/**
 * Clears the progress cache
 * Useful when logging out or switching users
 * @public
 */
export function clearCache() {
  invalidateCache();
  console.log('[DB] Cache cleared');
}

/**
 * Gets cache statistics for debugging
 * @public
 * @returns {Object} Cache stats
 */
export function getCacheStats() {
  return {
    isCached: cachedPayload !== null,
    isValid: isCacheValid(),
    age: cachedPayload ? Date.now() - cacheTimestamp : 0,
    ttl: CONFIG.CACHE_TTL
  };
}