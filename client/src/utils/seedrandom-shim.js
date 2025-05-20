// This file ensures seedrandom is correctly bundled and available
import seedrandom from 'seedrandom';

// Make it available globally for TensorFlow.js
if (typeof window !== 'undefined') {
  window.seedrandom = seedrandom;
}

export default seedrandom;
