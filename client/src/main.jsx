import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store.js";
import { Toaster } from "./components/ui/toaster.jsx";
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

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </BrowserRouter>
);
