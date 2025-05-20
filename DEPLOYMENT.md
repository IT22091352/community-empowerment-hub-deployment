# Community Empowerment Hub Deployment Guide

## Production Domain
The application is deployed at: https://community-empowerment-hub-313ac18da07a.herokuapp.com/

## Deployment Steps

1. **Set Environment Variables on Heroku**
  

2. **Push to Heroku**
   ```bash
   git add .
   git commit -m "Update for production deployment"
   git push heroku main
   ```

3. **Verify Deployment**
   After deployment, check the following endpoint to verify your configuration:
   https://community-empowerment-hub-313ac18da07a.herokuapp.com/api/system/config-check

## Troubleshooting

If you encounter issues with module dependencies:

1. Check Heroku logs: `heroku logs --tail --app community-empowerment-hub`
2. Make sure all dependencies are in the `dependencies` section (not devDependencies)
3. If seedrandom errors occur, check that the compatibility files are working correctly

## API Configuration

The application uses a dynamic API configuration system:

1. In production, API calls automatically use the current domain 
2. Environmental detection is used to determine if running on Heroku
3. Client-side env-config.js provides runtime configuration
4. API health endpoints are available at `/api/health/health` and `/api/health/info`

## Connection Issues Fixes

If you encounter "ERR_CONNECTION_REFUSED" errors:

1. The application uses dynamic API URL detection
2. Check browser console for API connectivity diagnostics
3. Verify CORS is properly configured in server.js
4. Test API connectivity by visiting: `https://community-empowerment-hub-313ac18da07a.herokuapp.com/api/health/health`

## TypeError Fixes

For "Cannot read properties of undefined (reading 'match')" errors:

1. Null checking has been added to all code using `.match()` method
2. The AI Tool component properly checks for missing analysis results
3. Proper fallbacks are provided for undefined values

The API base URL is: `https://community-empowerment-hub-313ac18da07a.herokuapp.com/api`

All frontend requests should use this base URL in production.
