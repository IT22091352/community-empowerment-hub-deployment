// API configuration using our centralized API constants
import { getApiUrl, DEV_API_URL, PRODUCTION_DOMAIN } from '../utils/api-constants';

// Determine API URL based on environment with multiple fallbacks
let apiBaseUrl;

// Try-catch to avoid errors when determining the API URL
try {
  // Priority 1: Use window.ENV if available (from env-config.js)
  if (typeof window !== 'undefined' && window.ENV?.API_URL) {
    apiBaseUrl = window.ENV.API_URL;
    console.log('Using API URL from window.ENV:', apiBaseUrl);
  } 
  // Priority 2: Use dynamic detection based on current domain
  else {
    apiBaseUrl = getApiUrl();
    console.log('Using dynamically detected API URL:', apiBaseUrl);
  }
} catch (error) {
  console.error('Error determining API URL:', error);
  
  // Priority 3: When in development environment
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    apiBaseUrl = DEV_API_URL;
    console.log('Using development API URL:', apiBaseUrl);
  } 
  // Priority 4: Final fallback to production URL
  else {
    apiBaseUrl = `${PRODUCTION_DOMAIN}/api`;
    console.log('Using fallback production API URL:', apiBaseUrl);
  }
}

// Export the base URL for API calls
export const API_URL = apiBaseUrl;

// Support for both local and production URLs
export const LOCAL_API_URL = DEV_API_URL;
export const PRODUCTION_API_URL = `${PRODUCTION_DOMAIN}/api`;

// Export existing configuration
export * from './index';