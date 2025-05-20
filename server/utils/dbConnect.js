// This file handles MongoDB connections for Vercel serverless functions
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI is missing! Attempting to connect with default URI.');
  // Provide a fallback for development only - remove in production
  if (process.env.NODE_ENV !== 'production') {
    console.warn('Using fallback MongoDB connection for development');
  } else {
    throw new Error('Please define the MONGODB_URI or MONGO_URI environment variable');
  }
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      // These options help with connection stability in serverless environments
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('Connected to MongoDB');
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;