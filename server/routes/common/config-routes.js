// This file helps check if the app is properly configured for your domain
const express = require('express');
const router = express.Router();

router.get('/config-check', (req, res) => {
  // Return essential configuration info (safe to expose)
  const config = {
    nodeEnv: process.env.NODE_ENV,
    hasMongoConnection: !!process.env.MONGODB_URI || !!process.env.MONGO_URI,
    serverUrl: `${req.protocol}://${req.get('host')}`,
    hasJwtSecret: !!process.env.JWT_SECRET,
    hasCloudinaryConfig: !!process.env.CLOUDINARY_CLOUD_NAME,
    cors: {
      origin: process.env.NODE_ENV === 'production' 
        ? ["https://community-empowerment-hub-313ac18da07a.herokuapp.com", "https://community-empowerment-hub.herokuapp.com"]
        : "http://localhost:5173",
    }
  };
  
  res.json({
    message: 'Configuration check for community-empowerment-hub',
    config
  });
});

module.exports = router;
