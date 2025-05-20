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
  // Priority 2: Use production URL directly for production environment
  else if (process.env.NODE_ENV === 'production') {
    apiBaseUrl = 'https://community-empowerment-hub-313ac18da07a.herokuapp.com/api';
    console.log('Using production API URL:', apiBaseUrl);
  } 
  // Priority 3: When in development environment
  else {
    apiBaseUrl = 'http://localhost:5000/api';
    console.log('Using development API URL:', apiBaseUrl);
  }
} catch (error) {
  console.error('Error determining API URL:', error);
  apiBaseUrl = 'http://localhost:5000/api';
}

// Export the base URL for API calls
export const API_URL = apiBaseUrl;

// Support for both local and production URLs
export const LOCAL_API_URL = DEV_API_URL;
export const PRODUCTION_API_URL = `${PRODUCTION_DOMAIN}/api`;

// Export existing configuration
export * from './index';