import { useState } from 'react';
import axios from 'axios';
import { testCorsConfiguration } from '../../utils/test-cors';

// Simple component to run API tests and diagnose issues
const ApiDiagnosticPage = () => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const runTests = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await testCorsConfiguration();
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const tryLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      }, {
        withCredentials: true
      });
      setResults(JSON.stringify(response.data, null, 2));
    } catch (err) {
      setError(`Login error: ${err.message}`);
      if (err.response) {
        console.error('Response error data:', err.response.data);
        setError(`Login error: ${err.message} - ${JSON.stringify(err.response.data)}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">API Diagnostic Tool</h1>
      <p className="mb-4">Use this page to diagnose API and CORS issues</p>
      
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={runTests}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Running Tests...' : 'Run CORS Tests'}
        </button>
        
        <button 
          onClick={tryLogin}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
        >
          {loading ? 'Testing...' : 'Test Login API'}
        </button>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-300 rounded mb-6">
          <h2 className="text-lg font-semibold text-red-800">Error</h2>
          <pre className="whitespace-pre-wrap text-red-800">{error}</pre>
        </div>
      )}
      
      {results && (
        <div className="p-4 bg-green-100 border border-green-300 rounded">
          <h2 className="text-lg font-semibold text-green-800">Results</h2>
          <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded">{results}</pre>
        </div>
      )}
      
      <div className="mt-8 bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Configuration Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>API URL: <code>{window.ENV?.API_URL || '/api'}</code></li>
          <li>Environment: {process.env.NODE_ENV}</li>
          <li>Vite Proxy: <code>/api → https://community-empowerment-hub-313ac18da07a.herokuapp.com</code></li>
        </ul>
      </div>
    </div>
  );
};

export default ApiDiagnosticPage;
