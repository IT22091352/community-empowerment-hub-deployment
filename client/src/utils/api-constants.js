/**
 * API Constants
 * 
 * This file contains all API-related configuration constants that can be used
 * across the application to ensure consistency.
 */

// Production domain
export const PRODUCTION_DOMAIN = 'https://community-empowerment-hub-313ac18da07a.herokuapp.com';

// Development API URL
export const DEV_API_URL = 'https://community-empowerment-hub-313ac18da07a.herokuapp.com/api';

// Helper function to determine environment
export const isProduction = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname.includes('herokuapp.com') || 
           (typeof import.meta !== 'undefined' && import.meta.env?.PROD);
  }
  return false;
};

// Determine the base domain for API calls
export const getBaseDomain = () => {
  if (typeof window !== 'undefined') {
    // If we're in the browser
    return window.location.origin;
  } 
  return PRODUCTION_DOMAIN;
};

// Get the full API URL based on environment
export const getApiUrl = () => {
  const baseDomain = getBaseDomain();
  return `${baseDomain}/api`;
};
