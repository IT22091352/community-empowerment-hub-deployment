// API configuration using Vite environment variables and production detection
// First, check if there is a global ENV object (from env-config.js)
let apiBaseUrl;

// Try-catch to avoid errors when window.ENV doesn't exist
try {
  if (typeof window !== 'undefined' && window.ENV?.API_URL) {
    // Use the global ENV configuration if available (highest priority)
    apiBaseUrl = window.ENV.API_URL;
    console.log('Using API URL from window.ENV:', apiBaseUrl);
  } else {
    // Use Vite environment detection as fallback
    const isProd = typeof window !== 'undefined' 
      ? (import.meta.env.PROD || window.location.hostname.includes('herokuapp.com'))
      : false;
      
    const prodDomain = 'https://community-empowerment-hub-313ac18da07a.herokuapp.com';
    
    // In production, use the full domain, otherwise use relative path or env var
    apiBaseUrl = isProd 
      ? `${prodDomain}/api`
      : (import.meta.env?.VITE_API_URL || '/api');
      
    console.log('Using detected API URL:', apiBaseUrl);
  }
} catch (error) {
  console.error('Error determining API URL:', error);
  // Fallback to absolute production URL to prevent connection issues
  apiBaseUrl = 'https://community-empowerment-hub-313ac18da07a.herokuapp.com/api';
  console.log('Using fallback API URL:', apiBaseUrl);
}

// Export the base URL for API calls
export const API_URL = apiBaseUrl;

// Export existing configuration
export * from './index';