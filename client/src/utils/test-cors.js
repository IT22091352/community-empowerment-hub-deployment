/**
 * This utility helps test CORS configuration
 */
import axios from 'axios';

// Test endpoints with both absolute URLs and proxy-based ones
export const testCorsConfiguration = async () => {
  try {
    console.log('🔍 Testing CORS configuration...');
    
    // Test the proxy with a relative URL
    console.log('Testing proxy with relative URL...');
    try {
      const proxyResponse = await axios.get('/api/health/health', {
        withCredentials: true
      });
      console.log('✅ Proxy test succeeded:', proxyResponse.data);
    } catch (error) {
      console.error('❌ Proxy test failed:', error.message);
    }
    
    // Test with absolute URL (should have CORS issues, showing proxy works)
    console.log('Testing absolute URL (expected to fail due to CORS)...');
    try {
      const directResponse = await axios.get('https://community-empowerment-hub-313ac18da07a.herokuapp.com/api/health/health', {
        withCredentials: true
      });
      console.log('Direct test succeeded (unexpected):', directResponse.data);
    } catch (error) {
      console.log('⚠️ Direct test failed as expected:', error.message);
      console.log('This is normal - it shows that the proxy is necessary to avoid CORS');
    }
    
    return 'Tests completed - check console for results';
  } catch (error) {
    console.error('Error running CORS tests:', error);
    return 'Tests failed';
  }
};
