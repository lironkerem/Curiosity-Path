// Mini-Apps/SelfAnalysisPro/js/astrology.js
// AstrologyEngine — Free Astrology API integration

import { getPlanets, getHouses, getNatalWheelChart } from './astroAPI.js';

export class AstrologyEngine {
  constructor() {
    // [name, startMonth, startDay, planet, element]
    this.zodiacData = Object.freeze([
      Object.freeze(["Capricorn",   1,  1,  "Saturn",          "Earth"]),
      Object.freeze(["Aquarius",    1,  20, "Saturn, Uranus",   "Air"]),
      Object.freeze(["Pisces",      2,  19, "Jupiter, Neptune", "Water"]),
      Object.freeze(["Aries",       3,  21, "Mars",             "Fire"]),
      Object.freeze(["Taurus",      4,  20, "Venus",            "Earth"]),
      Object.freeze(["Gemini",      5,  21, "Mercury",          "Air"]),
      Object.freeze(["Cancer",      6,  21, "Moon",             "Water"]),
      Object.freeze(["Leo",         7,  23, "Sun",              "Fire"]),
      Object.freeze(["Virgo",       8,  23, "Mercury",          "Earth"]),
      Object.freeze(["Libra",       9,  23, "Venus",            "Air"]),
      Object.freeze(["Scorpio",     10, 23, "Mars, Pluto",      "Water"]),
      Object.freeze(["Sagittarius", 11, 22, "Jupiter",          "Fire"]),
      Object.freeze(["Capricorn",   12, 22, "Saturn",           "Earth"])
    ]);

    this.sefiraMapping = Object.freeze({
      "Sun":     "Tiferet (Beauty)",
      "Moon":    "Yesod (Foundation)",
      "Mercury": "Hod (Splendor)",
      "Venus":   "Netzach (Victory)",
      "Mars":    "Gevurah (Strength)",
      "Jupiter": "Chesed (Kindness)",
      "Saturn":  "Binah (Understanding)",
      "Neptune": "Chokhmah (Wisdom)",
      "Pluto":   "Keter (Crown)",
      "Earth":   "Malkuth (Kingdom)",
      "Uranus":  "Chokhmah (Wisdom)"
    });
  }

  getZodiacSign(month, day) {
    for (let i = this.zodiacData.length - 1; i >= 0; i--) {
      const [name, m, d, planet, element] = this.zodiacData[i];
      if (month > m || (month === m && day >= d)) {
        return { name, planet, element };
      }
    }
    return {
      name:    this.zodiacData[0][0],
      planet:  this.zodiacData[0][3],
      element: this.zodiacData[0][4]
    };
  }

  getSefiraFromPlanet(planet) {
    const primaryPlanet = String(planet || '').split(',')[0].trim();
    return this.sefiraMapping[primaryPlanet] || "Malkuth (Kingdom)";
  }

  async analyze(formData) {
    try {
      const { dateOfBirth, timeOfBirth, locationLat, locationLon, tzone } = formData;

      if (!dateOfBirth) throw new Error('Date of birth is required.');

      const parts = dateOfBirth.split('-').map(Number);
      const year  = parts[0];
      const month = parts[1];
      const day   = parts[2];

      if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
        throw new Error('Invalid date of birth format.');
      }

      const zodiac = this.getZodiacSign(month, day);
      const sefira = this.getSefiraFromPlanet(zodiac.planet);

      // Basic-only path — no time/location
      if (!timeOfBirth || !locationLat || !locationLon ||
          locationLat === '' || locationLon === '' || timeOfBirth === '') {
        console.warn('Missing time/location — returning basic astrology only');
        return { zodiac, sefira, planets: null, houses: null, aspects: null, natalChart: null };
      }

      // Validate coordinates
      const lat = parseFloat(locationLat);
      const lon = parseFloat(locationLon);
      if (!isFinite(lat) || !isFinite(lon)) {
        throw new Error('Invalid location coordinates.');
      }

      const timeParts = timeOfBirth.split(':').map(Number);
      const hour   = timeParts[0];
      const minute = timeParts[1];

      if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
        throw new Error('Invalid time of birth format.');
      }

      const params = {
        year,
        month,
        date:      day,
        hours:     hour,
        minutes:   minute,
        seconds:   0,
        latitude:  lat,
        longitude: lon,
        timezone:  typeof tzone === 'number' ? tzone : 0
      };

      const planets    = await getPlanets(params);
      const houses     = await getHouses(params);
      const natalChart = await getNatalWheelChart(params);

      return { zodiac, sefira, planets, houses, natalChart };

    } catch (err) {
      console.error('AstrologyEngine.analyze() failed:', err.message);
      throw err;
    }
  }
}
