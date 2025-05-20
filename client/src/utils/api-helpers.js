/**
 * Helper functions for API configuration and error handling
 */
import axios from 'axios';
import { API_URL } from '../config/apiConfig';

// Create a base axios instance with common configuration
export const createAuthenticatedAPI = (baseURL = API_URL) => {
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
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Add response interceptor for error handling
  instance.interceptors.response.use(
    (response) => response,
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
        // The request was made but no response was received
        console.error('API No Response:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('API Request Error:', error.message);
      }
      
      return Promise.reject(error);
    }
  );

  return instance;
};

// Function to test API connectivity
export const testAPIConnection = async () => {
  try {
    const response = await axios.get(`${API_URL}/health/health`, { timeout: 5000 });
    console.log('API Connection Test:', response.data);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('API Connection Test Failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
