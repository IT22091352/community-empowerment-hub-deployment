import React, { useState, useEffect } from 'react';
import { testAPIConnection } from '../utils/api-helpers';
import { API_URL, LOCAL_API_URL, PRODUCTION_API_URL } from '../config/apiConfig';

/**
 * ApiHealthIndicator - Shows API connectivity status in the UI
 * Only displays in development or when there are connection issues
 */
export const ApiHealthIndicator = () => {
  const [healthStatus, setHealthStatus] = useState({
    checking: true,
    success: false,
    apiUrl: API_URL,
    error: null
  });
  const [isExpanded, setIsExpanded] = useState(false);

  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const result = await testAPIConnection();
        setHealthStatus({
          checking: false,
          success: result.success,
          apiUrl: API_URL,
          results: result.results,
          error: result.success ? null : 'API connection failed'
        });
      } catch (error) {
        setHealthStatus({
          checking: false,
          success: false,
          apiUrl: API_URL,
          error: error.message
        });
      }
    };

    checkApiHealth();
    
    // Re-check every 30 seconds
    const interval = setInterval(checkApiHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Helper function to switch between API endpoints
  const switchEndpoint = (endpoint) => async () => {
    // Update window.ENV if available
    if (typeof window !== 'undefined' && window.ENV) {
      window.ENV.API_URL = endpoint;
    }
    
    // Force refresh the page
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  // Hide in production unless there are issues
  const shouldShow = () => {
    if (typeof window === 'undefined') return false;
    
    // Always show in development
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return true;
    }
    
    // In production, only show if there are issues
    return !healthStatus.success;
  };
  
  if (!shouldShow()) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        zIndex: 9999,
        backgroundColor: healthStatus.checking ? '#f39c12' : 
                         healthStatus.success ? '#2ecc71' : '#e74c3c',
        color: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        fontSize: '12px',
        maxWidth: isExpanded ? '400px' : '200px',
        transition: 'max-width 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 'bold' }}>API Status:</span> {' '}
          {healthStatus.checking ? 'Checking...' : 
           healthStatus.success ? 'Connected' : 'Connection Issue'}
        </div>
        <button 
          onClick={() => setIsExpanded(!isExpanded)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '14px',
            marginLeft: '10px'
          }}
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>
      
      {isExpanded && (
        <div style={{ marginTop: '10px', fontSize: '11px' }}>
          <div>Current API: {healthStatus.apiUrl}</div>
          
          {!healthStatus.success && (
            <div style={{ marginTop: '8px' }}>
              <div>Try other endpoints:</div>
              <div style={{ marginTop: '5px', display: 'flex', gap: '8px' }}>
                <button 
                  onClick={switchEndpoint(LOCAL_API_URL)}
                  style={{
                    padding: '4px 8px',
                    background: '#3498db',
                    border: 'none',
                    borderRadius: '3px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}
                >
                  Use Local API
                </button>
                <button 
                  onClick={switchEndpoint(PRODUCTION_API_URL)}
                  style={{
                    padding: '4px 8px',
                    background: '#3498db',
                    border: 'none',
                    borderRadius: '3px',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '10px'
                  }}
                >
                  Use Production API
                </button>
              </div>
            </div>
          )}
          
          {healthStatus.error && (
            <div style={{ marginTop: '8px', color: '#ffcccc' }}>
              Error: {healthStatus.error}
            </div>
          )}
          
          {healthStatus.results && (
            <div style={{ marginTop: '8px' }}>
              {Object.entries(healthStatus.results).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '3px' }}>
                  {key}: {value.success ? '✓' : '✗'}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ApiHealthIndicator;
