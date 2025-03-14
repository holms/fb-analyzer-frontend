/**
 * Configuration utility for the FB Analyzer Frontend
 * Centralizes access to environment variables and configuration settings
 * Supports both build-time and runtime environment variables
 */

// Get environment variables from window.env (runtime) or process.env (build time)
const getEnv = (key, defaultValue) => {
  // Check if we have runtime config from docker-entrypoint.sh
  if (window.env && window.env[key] !== undefined && window.env[key] !== '') {
    return window.env[key];
  }
  // Fall back to build-time env vars
  if (process.env[key] !== undefined && process.env[key] !== '') {
    return process.env[key];
  }
  // Use default value as last resort
  return defaultValue;
};

// API configuration
export const API_CONFIG = {
  BASE_URL: getEnv('REACT_APP_API_BASE_URL', 'http://localhost:8000'),
};

// Facebook Graph API configuration
export const FACEBOOK_CONFIG = {
  API_VERSION: getEnv('REACT_APP_FACEBOOK_API_VERSION', 'v18.0'),
  APP_ID: getEnv('REACT_APP_FACEBOOK_APP_ID', ''),
  GRAPH_API_URL: `https://graph.facebook.com/${getEnv('REACT_APP_FACEBOOK_API_VERSION', 'v18.0')}`,
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
