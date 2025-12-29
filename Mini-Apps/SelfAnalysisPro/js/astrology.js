// js/astrology.js
// AstrologyEngine for Free Astrology API
// DEBUG VERSION - Add logging

import { getPlanets, getHouses, getAspects, getNatalWheelChart } from './astroAPI.js';

export class AstrologyEngine {
  constructor() {
    console.log('AstrologyEngine initialized (Free Astrology API)');
    
    // Updated zodiac data with dual planets
    this.zodiacData = [
      ["Capricorn", 1, 1, "Saturn", "Earth"],
      ["Aquarius", 1, 20, "Saturn, Uranus", "Air"],
      ["Pisces", 2, 19, "Jupiter, Neptune", "Water"],
      ["Aries", 3, 21, "Mars", "Fire"],
      ["Taurus", 4, 20, "Venus", "Earth"],
      ["Gemini", 5, 21, "Mercury", "Air"],
      ["Cancer", 6, 21, "Moon", "Water"],
      ["Leo", 7, 23, "Sun", "Fire"],
      ["Virgo", 8, 23, "Mercury", "Earth"],
      ["Libra", 9, 23, "Venus", "Air"],
      ["Scorpio", 10, 23, "Mars, Pluto", "Water"],
      ["Sagittarius", 11, 22, "Jupiter", "Fire"],
      ["Capricorn", 12, 22, "Saturn", "Earth"]
    ];
    
    this.sefiraMapping = {
      "Sun": "Tiferet (Beauty)",
      "Moon": "Yesod (Foundation)",
      "Mercury": "Hod (Splendor)",
      "Venus": "Netzach (Victory)",
      "Mars": "Gevurah (Strength)",
      "Jupiter": "Chesed (Kindness)",
      "Saturn": "Binah (Understanding)",
      "Neptune": "Chokhmah (Wisdom)",
      "Pluto": "Keter (Crown)",
      "Earth": "Malkuth (Kingdom)",
      "Uranus": "Chokhmah (Wisdom)"
    };
  }
  
  getZodiacSign(month, day) {
    for (let i = this.zodiacData.length - 1; i >= 0; i--) {
      const [name, m, d, planet, element] = this.zodiacData[i];
      if (month > m || (month === m && day >= d)) {
        return { name, planet, element };
      }
    }
    return { 
      name: this.zodiacData[0][0], 
      planet: this.zodiacData[0][3], 
      element: this.zodiacData[0][4] 
    };
  }
  
  getSefiraFromPlanet(planet) {
    const primaryPlanet = planet.split(',')[0].trim();
    return this.sefiraMapping[primaryPlanet] || "Malkuth (Kingdom)";
  }

  async analyze(formData) {
    try {
      console.log('🔍 AstrologyEngine.analyze() called with formData:', formData);
      
      const { dateOfBirth, timeOfBirth, locationLat, locationLon, tzone } = formData;
      
      if (!dateOfBirth) {
        throw new Error("Date of birth is required.");
      }
      
      // Parse DOB and get basic astrology (always works)
      const [year, month, day] = dateOfBirth.split('-').map(Number);
      console.log('📅 Parsed date:', { year, month, day });
      
      const zodiac = this.getZodiacSign(month, day);
      const sefira = this.getSefiraFromPlanet(zodiac.planet);
      
      console.log('♈ Basic astrology:', { zodiac, sefira });
      
      // If no time/location, return basic astrology only
      if (!timeOfBirth || !locationLat || !locationLon || 
          locationLat === "" || locationLon === "" || timeOfBirth === "") {
        console.warn("⚠️ Missing time/location - returning basic astrology only");
        console.log('Missing data:', { 
          timeOfBirth: timeOfBirth || 'MISSING', 
          locationLat: locationLat || 'MISSING', 
          locationLon: locationLon || 'MISSING' 
        });
        return {
          zodiac: zodiac,
          sefira: sefira,
          planets: null,
          houses: null,
          aspects: null,
          natalChart: null
        };
      }
      
      // Full natal chart with API - FREE ASTROLOGY API FORMAT
      const [hour, minute] = timeOfBirth.split(':').map(Number);
      const params = {
        year, 
        month, 
        date: day,  // FREE API uses "date" not "day"
        hours: hour,  // FREE API uses "hours" not "hour"
        minutes: minute,  // FREE API uses "minutes" not "min"
        seconds: 0,  // Always include seconds
        latitude: parseFloat(locationLat),  // FREE API uses "latitude" not "lat"
        longitude: parseFloat(locationLon),  // FREE API uses "longitude" not "lon"
        timezone: tzone || 0  // FREE API uses "timezone" not "tzone"
      };
      
      console.log('🌍 Full natal chart params:', params);
      console.log('📡 Calling Free Astrology API...');
      
      const planets = await getPlanets(params);
      console.log('✅ Planets received:', planets);
      
      const houses = await getHouses(params);
      console.log('✅ Houses received:', houses);
      
      const natalChart = await getNatalWheelChart(params);
      console.log('✅ Natal chart received:', natalChart);
      
      return {
        zodiac: zodiac,
        sefira: sefira,
        planets,
        houses,
        natalChart
      };
    } catch (err) {
      console.error("❌ AstrologyEngine analyze() failed:", err);
      console.error("Error details:", {
        message: err.message,
        stack: err.stack
      });
      throw err;
    }
  }
}