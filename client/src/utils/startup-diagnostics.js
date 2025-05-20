/**
 * Startup Diagnostics
 * 
 * This module runs automated diagnostics when the app starts to help
 * identify and troubleshoot common issues, especially in production.
 */
import { API_URL } from '../config/apiConfig';
import { testAPIConnection } from './api-helpers';

// Tests we want to run at startup
const diagnostics = [
  {
    name: 'API Configuration Check',
    run: async () => {
      const result = { 
        success: true,
        apiUrl: API_URL,
        info: 'API URL properly configured'
      };
      
      // Check for potential issues
      if (!API_URL) {
        result.success = false;
        result.info = 'API URL is undefined';
      } else if (API_URL.includes('localhost') && window.location.hostname !== 'localhost') {
        result.success = false;
        result.info = `API URL (${API_URL}) points to localhost but app is running on ${window.location.hostname}`;
      }
      
      return result;
    }
  },
  {
    name: 'Environment Check',
    run: async () => {
      const isProd = window.location.hostname.includes('herokuapp.com') || 
                    (typeof import.meta !== 'undefined' && import.meta.env?.PROD);
      
      return { 
        success: true,
        environment: isProd ? 'production' : 'development',
        hostname: window.location.hostname,
        windowEnv: window.ENV ? 'available' : 'not available'
      };
    }
  },
  {
    name: 'API Connectivity Test',
    run: async () => {
      try {
        // Test basic API connectivity
        const connectionTest = await testAPIConnection();
        return connectionTest;
      } catch (error) {
        return {
          success: false,
          error: error.message
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
