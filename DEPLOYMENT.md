# Community Empowerment Hub Deployment Guide

## Production Domain
The application is deployed at: https://community-empowerment-hub-313ac18da07a.herokuapp.com/

## Deployment Steps

1. **Set Environment Variables on Heroku**
   ```bash
   heroku config:set MONGODB_URI=mongodb+srv://4warriors:4warriors@cluster0.14rms.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0 --app community-empowerment-hub
   heroku config:set JWT_SECRET=4warriors --app community-empowerment-hub
   heroku config:set NODE_ENV=production --app community-empowerment-hub
   heroku config:set CLOUDINARY_CLOUD_NAME=dqnmkhaow --app community-empowerment-hub
   heroku config:set CLOUDINARY_API_KEY=527893798379867 --app community-empowerment-hub
   heroku config:set CLOUDINARY_API_SECRET=IEvF81w1zbw5oJRK4MVZLV3L06A --app community-empowerment-hub
   ```

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

The API base URL is: `https://community-empowerment-hub-313ac18da07a.herokuapp.com/api`

All frontend requests should use this base URL in production.
