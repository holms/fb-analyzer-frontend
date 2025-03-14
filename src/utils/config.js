/**
 * Configuration utility for the FB Analyzer Frontend
 * Centralizes access to environment variables and configuration settings
 */

// API configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
};

// Facebook Graph API configuration
export const FACEBOOK_CONFIG = {
  API_VERSION: process.env.REACT_APP_FACEBOOK_API_VERSION || 'v18.0',
  APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID,
  GRAPH_API_URL: `https://graph.facebook.com/${process.env.REACT_APP_FACEBOOK_API_VERSION || 'v18.0'}`,
};

// Feature flags
export const FEATURES = {
  ENABLE_EVENTS_TAB: false, // Set to true when the events feature is ready
};

// Default settings
export const DEFAULTS = {
  PAGINATION: {
    PAGES_PER_PAGE: 10,
    EVENTS_PER_PAGE: 20,
  },
  REFRESH_INTERVAL: 60000, // 1 minute in milliseconds
};

// Export the complete config object
const config = {
  API: API_CONFIG,
  FACEBOOK: FACEBOOK_CONFIG,
  FEATURES,
  DEFAULTS,
};

export default config;
