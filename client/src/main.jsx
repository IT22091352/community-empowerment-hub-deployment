import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
import axios from "axios";
import { API_URL } from "./config/apiConfig";
// Import TensorFlow compatibility module
import './utils/tfjs-compat.js';
// Import startup diagnostics
import { runStartupDiagnostics } from './utils/startup-diagnostics';

// Run diagnostics in non-production or when explicitly enabled
let shouldRunDiagnostics = false;
let isHeroku = false;

try {
  // Safely check environment
  shouldRunDiagnostics = 
    (typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production') || 
    (typeof window !== 'undefined' && window.location && window.location.search && 
     window.location.search.includes('diagnostics=true'));
  
  // Safely check if we're on Heroku
  isHeroku = typeof window !== 'undefined' && window.location && 
             window.location.hostname && window.location.hostname.includes('herokuapp.com');
} catch (error) {
  console.error('Error checking diagnostic conditions:', error);
}

// Run diagnostics in background with error handling
if (shouldRunDiagnostics || isHeroku) {
  try {
    // Run diagnostics after a short delay to not block rendering
    setTimeout(() => {
      runStartupDiagnostics().catch(err => 
        console.error('Failed to run startup diagnostics:', err)
      );
    }, 1000);
  } catch (error) {
    console.error('Error setting up diagnostics:', error);
  }
}

// Function to help debug API URLs
const debugApiEndpoint = (path) => {
  const baseUrl = axios.defaults.baseURL || '';
  const fullUrl = baseUrl + path;
  console.log(`API Call: ${path} → Full URL: ${fullUrl}`);
  return path;
};

// Configure axios globally
try {
  // Set axios defaults for consistent API calls
  // Don't set baseURL if API_URL already includes '/api' to avoid path duplication
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.timeout = 20000; // 20 seconds timeout
  
  // Enable better error logging in development
  if (typeof process === 'undefined' || !process.env || process.env.NODE_ENV !== 'production') {
    axios.interceptors.request.use(request => {
      console.log('Starting API request:', request.method?.toUpperCase(), request.url);
      return request;
    });
    
    axios.interceptors.response.use(
      response => {
        console.log('API response received:', response.status, response.config.url);
        return response;
      },
      error => {
        console.error('API error response:', 
          error.response?.status || 'Network Error',
          error.config?.url,
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }
    console.log('Axios configured with baseURL:', axios.defaults.baseURL || '(using relative URLs)');
  
  // Add the debugApiEndpoint function to window for troubleshooting
  if (typeof window !== 'undefined') {
    window.debugApiEndpoint = debugApiEndpoint;
    window.axiosConfig = {
      baseURL: axios.defaults.baseURL,
      API_URL
    };
    console.log('API configuration helpers attached to window object for troubleshooting');
  }
} catch (error) {
  console.error('Error configuring axios:', error);
}

// Configure axios globally
try {
  // Set axios defaults for consistent API calls
  axios.defaults.baseURL = API_URL;
  axios.defaults.withCredentials = true;
  axios.defaults.timeout = 20000; // 20 seconds timeout
  
  // Enable better error logging in development
  if (typeof process === 'undefined' || !process.env || process.env.NODE_ENV !== 'production') {
    axios.interceptors.request.use(request => {
      console.log('Starting API request:', request.method?.toUpperCase(), request.url);
      return request;
    });
    
    axios.interceptors.response.use(
      response => {
        console.log('API response received:', response.status, response.config.url);
        return response;
      },
      error => {
        console.error('API error response:', 
          error.response?.status || 'Network Error',
          error.config?.url,
          error.response?.data || error.message
        );
        return Promise.reject(error);
      }
    );
  }
  
  console.log('Axios configured with baseURL:', axios.defaults.baseURL);
} catch (error) {
  console.error('Error configuring axios:', error);
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </BrowserRouter>
);
