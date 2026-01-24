// ============================================
// /api/geocode.js
// Geocoding endpoint using OpenStreetMap Nominatim
// Includes caching and rate limiting protection
// ============================================

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const MAX_CACHE_SIZE = 100;
const REQUEST_TIMEOUT = 8000; // 8 seconds
const MIN_QUERY_LENGTH = 3;
const RESULT_LIMIT = 5;

// In-memory cache for geocoding results
const cache = new Map();

// CORS whitelist
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://self-analysis-pro.vercel.app',
  'https://digital-curiosiry.vercel.app',
  'https://digital-curiosity.vercel.app',
  'https://lironkerem.wixsite.com'
];

/**
 * Cleans up cache by removing oldest entry
 */
function maintainCacheSize() {
  if (cache.size > MAX_CACHE_SIZE) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
}

/**
 * Checks if cached data is still valid
 * @param {Object} cached - Cached entry
 * @returns {boolean} True if cache is valid
 */
function isCacheValid(cached) {
  return cached && (Date.now() - cached.timestamp < CACHE_DURATION);
}

/**
 * Main handler for geocoding requests
 */
export default async function handler(req, res) {
  // CORS handling
  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q } = req.query;

  // Validate query parameter
  if (!q || typeof q !== 'string') {
    return res.status(400).json({ error: 'Missing query parameter' });
  }

  if (q.trim().length < MIN_QUERY_LENGTH) {
    return res.status(400).json({ 
      error: `Query must be at least ${MIN_QUERY_LENGTH} characters` 
    });
  }

  try {
    const cacheKey = q.toLowerCase().trim();
    const cached = cache.get(cacheKey);
    
    // Return cached result if valid
    if (isCacheValid(cached)) {
      return res.status(200).json(cached.data);
    }

    // Fetch from Nominatim with timeout
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=${RESULT_LIMIT}&addressdetails=1`;
    
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const response = await fetch(nominatimUrl, {
        headers: {
          'User-Agent': 'SelfAnalysisApp/1.0 (Contact: lironkerem@gmail.com)'
        },
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        throw new Error(`Nominatim returned status ${response.status}`);
      }

      const data = await response.json();
      
      // Store in cache
      cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      maintainCacheSize();

      return res.status(200).json(data);

    } catch (fetchError) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        return res.status(504).json({ 
          error: 'Request timeout',
          message: 'Location service took too long to respond'
        });
      }
      
      throw fetchError;
    }

  } catch (error) {
    console.error('Geocoding error:', error.message);
    return res.status(500).json({ 
      error: 'Failed to fetch locations',
      message: error.message 
    });
  }
}