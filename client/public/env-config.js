// Client-side environment configuration
(function(window) {
  // Environment detection
  const isHeroku = window.location.hostname.includes('herokuapp.com');
  const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const currentDomain = window.location.origin;
  
  // Production domain constant
  const PRODUCTION_DOMAIN = 'https://community-empowerment-hub-313ac18da07a.herokuapp.com';
  
  // Determine API URL based on environment
  let apiUrl;
  if (isHeroku || !isLocalhost) {
    // Production - use current domain
    apiUrl = `${currentDomain}/api`;
  } else {
    // Local development - use localhost:5000
    apiUrl = 'https://community-empowerment-hub-313ac18da07a.herokuapp.com/api';
  }
  
  // Make environment configuration available globally
  window.ENV = {
    // API URLs for different environments
    API_URL: apiUrl,
    PRODUCTION_API_URL: `${PRODUCTION_DOMAIN}/api`,
    LOCAL_API_URL: 'https://community-empowerment-hub-313ac18da07a.herokuapp.com/api',
    
    // Domain information
    APP_DOMAIN: window.location.hostname,
    PRODUCTION_DOMAIN: PRODUCTION_DOMAIN,
    
    // Environment flags
    IS_PRODUCTION: isHeroku || !isLocalhost,
    IS_DEVELOPMENT: isLocalhost,
    
    // App version
    VERSION: '1.0.0'
  };
  
  // Log the configuration for debugging
  console.log(`🌐 Running in ${window.ENV.IS_PRODUCTION ? 'production' : 'development'} mode`);
  console.log('📡 API URL:', window.ENV.API_URL);
  
  // Expose a helper function to switch API URLs if needed
  window.switchToProductionApi = function() {
    window.ENV.API_URL = window.ENV.PRODUCTION_API_URL;
    console.log('Switched to production API:', window.ENV.API_URL);
    return window.ENV.API_URL;
  };
  
  window.switchToLocalApi = function() {
    window.ENV.API_URL = window.ENV.LOCAL_API_URL;
    console.log('Switched to local API:', window.ENV.API_URL);
    return window.ENV.API_URL;
  };
})(window);
