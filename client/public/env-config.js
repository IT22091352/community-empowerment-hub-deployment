// Client-side environment configuration
window.ENV = {
  // Set production URLs
  API_URL: 'https://community-empowerment-hub-313ac18da07a.herokuapp.com/api',
  APP_DOMAIN: 'community-empowerment-hub-313ac18da07a.herokuapp.com',
  // Auto-detect environment
  IS_PRODUCTION: window.location.hostname.includes('herokuapp.com'),
  VERSION: '1.0.0'
};
