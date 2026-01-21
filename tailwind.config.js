/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './Core/**/*.js',
    './Features/**/*.js',
    './CSS/**/*.css'
  ],
  
  theme: {
    // Remove all default colors - themes handle colors
    colors: {},
    
    // Keep spacing, sizing, and layout utilities
    extend: {
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    }
  },

  corePlugins: {
    // Keep essential utilities
    preflight: true,        // CSS reset
    container: true,        // Container utilities
    accessibility: true,    // Screen reader utilities
    
    // Remove color-related plugins
    backgroundColor: false,
    backgroundOpacity: false,
    borderColor: false,
    borderOpacity: false,
    divideColor: false,
    divideOpacity: false,
    placeholderColor: false,
    placeholderOpacity: false,
    ringColor: false,
    ringOpacity: false,
    ringOffsetColor: false,
    textColor: false,
    textOpacity: false,
    gradientColorStops: false,
  },

  plugins: [],
}