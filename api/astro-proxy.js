// ============================================
// /api/astro-proxy.js
// Proxy endpoint for Free Astrology API
// Handles parameter mapping and request forwarding
// ============================================

const FREE_ASTRO_BASE_URL = 'https://json.freeastrologyapi.com';
const ALLOWED_ENDPOINTS = ['timezone', 'planets', 'ascendant', 'houses', 'aspects'];

/**
 * Validates required birth data parameters
 * @param {Object} params - Request parameters
 * @returns {Object|null} Error object if validation fails, null if valid
 */
function validateParams(params) {
  const { year, month, date, latitude, longitude } = params;

  if (!year || !month || !date) {
    return { error: 'Missing required date parameters (year, month, date)' };
  }

  if (latitude === undefined || longitude === undefined) {
    return { error: 'Missing required location parameters (latitude, longitude)' };
  }

  // Validate ranges
  if (year < 1900 || year > 2100) {
    return { error: 'Year must be between 1900 and 2100' };
  }

  if (month < 1 || month > 12) {
    return { error: 'Month must be between 1 and 12' };
  }

  if (date < 1 || date > 31) {
    return { error: 'Date must be between 1 and 31' };
  }

  if (latitude < -90 || latitude > 90) {
    return { error: 'Latitude must be between -90 and 90' };
  }

  if (longitude < -180 || longitude > 180) {
    return { error: 'Longitude must be between -180 and 180' };
  }

  return null;
}

/**
 * Main handler for astrology API proxy
 */
export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint, params } = req.body;

    if (!endpoint || !params) {
      return res.status(400).json({ error: 'Missing endpoint or params' });
    }

    // Handle timezone-only request
    if (endpoint === 'timezone') {
      return res.status(200).json({ tzone: 0 });
    }

    // Validate input parameters
    const validationError = validateParams(params);
    if (validationError) {
      return res.status(400).json(validationError);
    }

    // Check API key configuration
    if (!process.env.FREE_ASTRO_API_KEY) {
      console.error('FREE_ASTRO_API_KEY not configured');
      return res.status(500).json({ error: 'API key not configured' });
    }

    // Map parameters to Free Astrology API format
    const apiParams = {
      year: params.year,
      month: params.month,
      date: params.date,
      hours: params.hours ?? 0,
      minutes: params.minutes ?? 0,
      seconds: params.seconds ?? 0,
      latitude: params.latitude,
      longitude: params.longitude,
      timezone: params.timezone ?? params.tzone ?? 0
    };

    // Call Free Astrology API
    const apiUrl = `${FREE_ASTRO_BASE_URL}/${endpoint}`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.FREE_ASTRO_API_KEY
      },
      body: JSON.stringify(apiParams)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`Free Astrology API error: ${response.status}`, data);
      return res.status(response.status).json({ 
        error: 'Free Astrology API error', 
        details: data
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error('Fatal error in astro-proxy:', error.message);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message
    });
  }
}