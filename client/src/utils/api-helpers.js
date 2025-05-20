/**
 * Helper functions for API configuration and error handling
 */
import axios from 'axios';
import { API_URL, LOCAL_API_URL, PRODUCTION_API_URL } from '../config/apiConfig';

// Keep track of failed requests for auto-switching
let consecutiveFailures = 0;
const MAX_FAILURES_BEFORE_SWITCH = 3;

// Track if we've already attempted to switch API endpoints
let hasAttemptedApiSwitch = false;

// Create a base axios instance with common configuration
export const createAuthenticatedAPI = (baseURL = API_URL) => {
  console.log('Creating API instance with base URL:', baseURL);
  
  const instance = axios.create({
    baseURL,
    withCredentials: true,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add request interceptor for authentication
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      // Log request for debugging
      console.debug(`🔄 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => {
      // Reset failures counter on success
      consecutiveFailures = 0;
      return response;
    },
    (error) => {
      // Add centralized error handling here
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('API Error Response:', error.response.status, error.response.data);
        
        // Handle authentication errors
        if (error.response.status === 401) {
          console.log('Authentication error, redirecting to login...');
          // Redirect to login page or dispatch logout action here
        }
      } else if (error.request) {
        // Connection error - the request was made but no response was received
        console.error('API Connection Error:', error.message);
        consecutiveFailures++;
        
        // After several consecutive failures, try switching API endpoints
        if (consecutiveFailures >= MAX_FAILURES_BEFORE_SWITCH && !hasAttemptedApiSwitch) {
          hasAttemptedApiSwitch = true;
          
          // Attempt to switch API endpoints
          if (typeof window !== 'undefined' && window.ENV) {
            // If we're using localhost, try switching to production
            if (window.ENV.API_URL.includes('localhost')) {
              console.warn('🔄 Switching from local to production API after connection failures');
              window.ENV.API_URL = PRODUCTION_API_URL;
              
              // Show a helpful message in the console
              console.info(
                '%c⚠️ API Connection Issue', 
                'font-size: 14px; font-weight: bold; color: #f39c12;',
                '\nFailed to connect to local API. If you\'re developing locally, make sure your server is running on port 5000.\n\n' +
                'Attempting to use production API as fallback: ' + PRODUCTION_API_URL
              );
            } 
            // If in production but having issues, try localhost
            else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
              console.warn('🔄 Switching from production to local API after connection failures');
              window.ENV.API_URL = LOCAL_API_URL;
            }
          }
        }
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('API Request Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Function to test API connectivity with multiple endpoints
export const testAPIConnection = async () => {
  const endpoints = [
    { url: `${API_URL}/health/health`, name: 'Current API' },
    { url: `${API_URL}/system/config-check`, name: 'System Config' }
  ];
  
  // Also test the production endpoint if not already using it
  if (API_URL !== PRODUCTION_API_URL) {
    endpoints.push({ 
      url: `${PRODUCTION_API_URL}/health/health`, 
      name: 'Production API' 
    });
  }
  
  // Also test localhost if in development
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') &&
      API_URL !== LOCAL_API_URL) {
    endpoints.push({ 
      url: `${LOCAL_API_URL}/health/health`, 
      name: 'Local API' 
    });
  }
  
  const results = {};
  let overallSuccess = false;
  
  // Test each endpoint
  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint.url, { 
        timeout: 5000,
        validateStatus: status => status < 500 // Accept any non-server error response
      });
      
      results[endpoint.name] = {
        success: true,
        status: response.status,
        data: response.data
      };
      
      if (response.status < 400) {
        overallSuccess = true;
      }
      
      console.log(`API Test [${endpoint.name}]:`, response.status, response.data);
    } catch (error) {
      results[endpoint.name] = {
        success: false,
        error: error.message
      };
      console.error(`API Test [${endpoint.name}] Failed:`, error);
    }
  }
  
  return {
    success: overallSuccess,
    results,
    testedApiUrl: API_URL
  };
};
