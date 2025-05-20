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
const shouldRunDiagnostics = 
  process.env.NODE_ENV !== 'production' || 
  window.location.search.includes('diagnostics=true');

// Run diagnostics in background
if (shouldRunDiagnostics || window.location.hostname.includes('herokuapp.com')) {
  // Run diagnostics after a short delay to not block rendering
  setTimeout(() => {
    runStartupDiagnostics().catch(err => 
      console.error('Failed to run startup diagnostics:', err)
    );
  }, 1000);
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </BrowserRouter>
);
