// This file ensures seedrandom is correctly bundled and available
let seedrandom;

try {
  // Try to import seedrandom
  seedrandom = require('seedrandom');
} catch (e) {
  console.warn('Failed to load seedrandom:', e);
  // Provide a simple fallback implementation to prevent crashes
  seedrandom = (seed) => {
    return () => Math.random(); // Simple fallback that ignores seed
  };
}

// Make it available globally for TensorFlow.js
try {
  if (typeof window !== 'undefined') {
    window.seedrandom = seedrandom;
  }
} catch (e) {
  console.error('Failed to set global seedrandom:', e);
}

export default seedrandom;
