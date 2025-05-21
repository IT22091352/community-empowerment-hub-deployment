// This file handles MongoDB connections for Vercel serverless functions
const mongoose = require('mongoose');

// Get MongoDB URI from environment variables with fallback options
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

// Log MongoDB connection config (without exposing full credentials)
const logSafeMongoURI = (uri) => {
  if (!uri) return 'undefined';
  try {
    // Only show part of the connection string for security
    const regex = /mongodb(\+srv)?:\/\/([^:]+)(:.+)?@(.+)/;
    const match = uri.match(regex);
    if (match) {
      return `mongodb${match[1] || ''}://${match[2]}:***@${match[4]}`;
    }
    return 'Invalid URI format';
  } catch (err) {
    return 'Error parsing URI';
  }
};

console.log('MongoDB Connection Config:');
console.log('- URI exists:', !!MONGODB_URI);
console.log('- Sanitized URI:', logSafeMongoURI(MONGODB_URI));
console.log('- Environment:', process.env.NODE_ENV || 'development');

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
      // Enhanced options for better connection stability
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000, // Timeout after 10 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      maxPoolSize: 10, // Maintain up to 10 socket connections
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
      retryWrites: true,
      retryReads: true
    };

    console.log('Attempting to connect to MongoDB...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('✅ Connected to MongoDB successfully');
        
        // Log connection info for debugging
        const { host, port, name } = mongoose.connection;
        console.log(`- Connected to database: ${name}`);
        console.log(`- Host: ${host}:${port}`);
        console.log(`- MongoDB driver version: ${mongoose.version}`);
        
        return mongoose;
      })
      .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        
        // Enhanced error logging
        if (error.name === 'MongoServerSelectionError') {
          console.error('- Could not select a MongoDB server. Check network connectivity and MongoDB status.');
        } else if (error.name === 'MongoNetworkError') {
          console.error('- Network error connecting to MongoDB. Check VPN, firewall, or network settings.');
        } else if (error.name === 'MongooseServerSelectionError') {
          console.error('- Server selection timed out. The MongoDB server may be down or unreachable.');
        } else if (error.name === 'MongoParseError') {
          console.error('- Invalid MongoDB connection string. Please check the format.');
        }
        
        console.error('- Full error:', error);
        throw error;
      });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

module.exports = dbConnect;