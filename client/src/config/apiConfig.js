// API configuration using Vite environment variables and production detection
const isProd = import.meta.env.PROD || window.location.hostname.includes('herokuapp.com');
const prodDomain = 'https://community-empowerment-hub-313ac18da07a.herokuapp.com';

// In production, use the full domain, otherwise use relative path or env var
const apiBaseUrl = isProd 
  ? `${prodDomain}/api` 
  : (import.meta.env.VITE_API_URL || '/api');

// Export the base URL for API calls
export const API_URL = apiBaseUrl;

// Export existing configuration
export * from './index';