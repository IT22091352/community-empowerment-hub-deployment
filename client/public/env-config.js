// Client-side environment configuration
(function(window) {
  // Check if we're on Heroku
  const isHeroku = window.location.hostname.includes('herokuapp.com');
  // Get the current domain (supports custom domains too)
  const currentDomain = window.location.origin;
  
  window.ENV = {
    // Set production URLs - uses the current domain dynamically
    API_URL: isHeroku ? `${currentDomain}/api` : 'http://localhost:5000/api',
    APP_DOMAIN: window.location.hostname,
    // Auto-detect environment
    IS_PRODUCTION: isHeroku || window.location.hostname !== 'localhost',
    VERSION: '1.0.0'
  };
  
  // Log the configuration for debugging (will appear in browser console)
  if (window.ENV.IS_PRODUCTION) {
    console.log('Running in production mode');
    console.log('API URL:', window.ENV.API_URL);
  }
})(window);
