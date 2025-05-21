/**
 * Startup Diagnostics
 * 
 * This module runs automated diagnostics when the app starts to help
 * identify and troubleshoot common issues, especially in production.
 */
import axios from 'axios';
import { API_URL, LOCAL_API_URL, PRODUCTION_API_URL } from '../config/apiConfig';
import { testAPIConnection } from './api-helpers';
import { isProduction, getApiUrl } from './api-constants';

// Tests we want to run at startup
const diagnostics = [
  {
    name: 'API Configuration Check',
    run: async () => {
      const result = { 
        success: true,
        apiUrl: API_URL,
        localApiUrl: LOCAL_API_URL,
        productionApiUrl: PRODUCTION_API_URL,
        info: 'API URL properly configured'
      };
      
      // Check for potential issues
      if (!API_URL) {
        result.success = false;
        result.info = 'API URL is undefined';
      } else if (API_URL.includes('localhost') && typeof window !== 'undefined' && 
          window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        result.success = false;
        result.info = `API URL (${API_URL}) points to localhost but app is running on ${window.location.hostname}`;
      }
      
      return result;
    }
  },  {
    name: 'Environment Check',
    run: async () => {
      let isProd = false;
      let hostname = 'unknown';
      let windowEnvStatus = 'unknown';
      
      try {
        // Use safe access for window properties
        if (typeof window !== 'undefined') {
          hostname = window.location?.hostname || 'unknown';
          isProd = hostname.includes('herokuapp.com');
          windowEnvStatus = window.ENV ? 'available' : 'not available';
        }
        
        // Also check import.meta if available
        if (typeof import.meta !== 'undefined' && import.meta.env?.PROD) {
          isProd = true;
        }
      } catch (error) {
        console.error('Error checking environment:', error);
      }
      
      return { 
        success: true,
        environment: isProd ? 'production' : 'development',
        hostname: hostname,
        windowEnv: windowEnvStatus
      };
    }
  },  {
    name: 'API Connectivity Test',
    run: async () => {
      try {
        // Test basic API connectivity with timeout
        const connectionTest = await Promise.race([
          testAPIConnection(),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('API connectivity test timed out after 5000ms')), 5000)
          )
        ]);
        
        return connectionTest || { 
          success: false, 
          error: 'No response from API connectivity test' 
        };
      } catch (error) {
        return {
          success: false,
          error: error.message || 'Unknown error in API connectivity test'
        };
      }
    }
  }
];

// Run all diagnostics and log results
export const runStartupDiagnostics = async () => {
  console.group('📊 Application Startup Diagnostics');
  console.log('Running diagnostic tests to ensure proper configuration...');
  
  const results = {};
  
  for (const test of diagnostics) {
    try {
      console.log(`Running test: ${test.name}`);
      results[test.name] = await test.run();
      
      if (results[test.name].success) {
        console.log(`✅ ${test.name}: Success`, results[test.name]);
      } else {
        console.warn(`⚠️ ${test.name}: Warning`, results[test.name]);
      }
    } catch (error) {
      results[test.name] = { 
        success: false, 
        error: error.message 
      };
      console.error(`❌ ${test.name}: Failed`, error);
    }
  }
  
  // Check for critical issues
  const criticalIssues = Object.values(results).filter(r => !r.success);
  if (criticalIssues.length > 0) {
    console.warn(`⚠️ Found ${criticalIssues.length} potential issues that might affect application functionality.`);
  } else {
    console.log('✅ All diagnostics passed successfully!');
  }
  
  console.groupEnd();
  return results;
};

// Export individual tests for use elsewhere
export const diagnosticTests = diagnostics.reduce((acc, test) => {
  acc[test.name] = test.run;
  return acc;
}, {});
