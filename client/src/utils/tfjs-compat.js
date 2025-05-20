// This file provides compatibility for TensorFlow.js and its dependencies
import seedrandom from './seedrandom-shim';

// Ensure seedrandom is loaded before TensorFlow.js
export default {
  seedrandom
};
