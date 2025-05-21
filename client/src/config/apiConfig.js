// API configuration using our centralized API constants
import { getApiUrl, DEV_API_URL, PRODUCTION_DOMAIN } from '../utils/api-constants';

// Determine API URL based on environment with multiple fallbacks
let apiBaseUrl;

// Try-catch to avoid errors when determining the API URL
try {
  // Priority 1: Use window.ENV if available (from env-config.js)
  if (typeof window !== 'undefined' && window.ENV && window.ENV.API_URL) {
    apiBaseUrl = window.ENV.API_URL;
    console.log('Using API URL from window.ENV:', apiBaseUrl);
  } 
  // Priority 2: Use production URL directly for production environment
  else if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'production') {
    // In production, we can use relative URLs if the frontend and API are deployed together
    // or the full URL if they're on different domains
    apiBaseUrl = '/api';
    console.log('Using production API URL:', apiBaseUrl);
  }
  // Priority 3: When in development environment
  else {
    // Use relative URL to work with Vite's proxy
    apiBaseUrl = '/api';
    console.log('Using development API URL with proxy:', apiBaseUrl);
  }
} catch (error) {
  console.error('Error determining API URL:', error);
  apiBaseUrl = '/api'; // Fallback to relative URL
}

// Export the base URL for API calls - this should be an empty string if we're using relative '/api' path
// to prevent the double '/api/api/' issue
export const API_URL = apiBaseUrl === '/api' ? '' : apiBaseUrl;

// Support for both local and production URLs
export const LOCAL_API_URL = DEV_API_URL;
export const PRODUCTION_API_URL = `${PRODUCTION_DOMAIN}/api`;

// Export existing configuration
export * from './index';



import axios from 'axios';

const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

export default apiClient;