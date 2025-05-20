// API Health Check Routes
const express = require('express');
const router = express.Router();

// Simple health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    message: 'API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    host: req.headers.host
  });
});

// More detailed API information
router.get('/info', (req, res) => {
  res.status(200).json({
    status: 'ok',
    apiVersion: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    clientOrigin: req.headers.origin || 'Unknown'
  });
});

module.exports = router;
