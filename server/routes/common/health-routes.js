// API Health Check Routes
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Simple health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    host: req.headers.host,
    serverTime: new Date().toLocaleTimeString()
  });
});

// Check for specific client connectivity issues
router.get('/connectivity-test', (req, res) => {
  res.status(200).json({
    connectivity: 'success',
    clientIp: req.ip || req.connection.remoteAddress,
    headers: {
      host: req.headers.host,
      origin: req.headers.origin,
      referer: req.headers.referer,
    },
    cors: {
      enabled: true,
      allowedOrigins: process.env.NODE_ENV === 'production'
        ? ['https://community-empowerment-hub-313ac18da07a.herokuapp.com', 'https://community-empowerment-hub.herokuapp.com']
        : 'http://localhost:5173'
    }
  });
});

// More detailed API information
router.get('/info', (req, res) => {
  // Check MongoDB connection status
  const isDbConnected = mongoose.connection.readyState === 1;
  
  res.status(200).json({
    status: 'ok',
    apiVersion: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    clientOrigin: req.headers.origin || 'Unknown',
    database: {
      connected: isDbConnected,
      name: mongoose.connection.name || 'Not connected',
      host: mongoose.connection.host || 'Not connected'
    }
  });
});

module.exports = router;
