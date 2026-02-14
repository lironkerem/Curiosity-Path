/**
 * SOLAR-CONSTANTS.JS
 * Centralized configuration constants for Solar Cycle system
 */

const SOLAR_CONSTANTS = {
  // UI Configuration
  PRESENCE_RANGE: { min: 8, max: 23 },
  FLOATING_ELEMENT_COUNT: 20,
  UPDATE_INTERVAL_MS: 600000, // 10 minutes
  
  // Storage Configuration
  STORAGE_PREFIX: 'solar_',
  STORAGE_KEY_SUFFIX: '_data',
  
  // Image Configuration
  IMAGE_BASE_URL: 'https://raw.githubusercontent.com/lironkerem/Digital-Curiosiry/main/Public/Community/Solar/',
  
  // Season Names
  SEASONS: {
    SPRING: 'spring',
    SUMMER: 'summer',
    AUTUMN: 'autumn',
    WINTER: 'winter'
  },
  
  // Validation
  MIN_REFLECTION_LENGTH: 10,
  
  // Animation
  FLOATING_ELEMENT_DURATION_MIN: 10,
  FLOATING_ELEMENT_DURATION_RANGE: 10,
  FLOATING_ELEMENT_DELAY_MAX: 5
};

window.SOLAR_CONSTANTS = SOLAR_CONSTANTS;
console.log('⚙️ Solar Constants loaded');
