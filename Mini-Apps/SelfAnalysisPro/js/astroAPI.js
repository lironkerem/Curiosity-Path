// Mini-Apps/SelfAnalysisPro/js/astroAPI.js
// Client wrapper for the Vercel astro-proxy

const PROXY   = '/api/astro-proxy';
const TIMEOUT = 15000; // 15 s per attempt

async function callAstroWithRetry(endpoint, params, retries = 2) {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const res = await fetch(PROXY, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ endpoint, params }),
        signal:  AbortSignal.timeout(TIMEOUT)
      });

      if (!res.ok) {
        const errorText = await res.text();
        let message;
        try   { message = JSON.parse(errorText).message || 'Astrology API error'; }
        catch { message = errorText || 'Unknown error'; }
        throw new Error(message);
      }

      return await res.json();

    } catch (error) {
      console.error(`Astrology API attempt ${attempt + 1}/${retries} failed:`, error.message);

      if (attempt === retries - 1) throw error;

      await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
    }
  }
}

export async function getPlanets(params) {
  return callAstroWithRetry('western/planets', params);
}

export async function getHouses(params) {
  return callAstroWithRetry('western/houses', params);
}

export async function getAspects(params) {
  return callAstroWithRetry('western/aspects', params);
}

export async function getNatalWheelChart(params) {
  return callAstroWithRetry('western/natal-wheel-chart', params);
}
