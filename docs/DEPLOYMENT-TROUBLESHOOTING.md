# Deployment Troubleshooting Guide

## Key Changes Made

1. **Fixed Server Startup**: The main issue was that your app wasn't starting in production mode. Now it properly exports the app for IIS.

2. **Added Health Check Endpoints**: Added `/health` and `/` endpoints to test if the API is responding.

3. **Improved Error Handling**: Added global error handler and better logging.

4. **Updated web.config**: Made it more compatible with shared hosting.

## Testing Steps

1. **Deploy the updated code** to your hosting provider
2. **Run the build command**: `npm run build`
3. **Test the health endpoint**: Try accessing `https://yourdomain.com/health`
4. **Test the root endpoint**: Try accessing `https://yourdomain.com/`

## Common Issues & Solutions

### 500 Error
- **Cause**: Usually database connection or environment variables
- **Solution**: Check if your `.env` file is uploaded and has correct database credentials

### Buffer Deprecation Warning
- **Cause**: Old Node.js Buffer usage in dependencies
- **Solution**: This is just a warning, not an error. It won't break your app.

### Database Connection Issues
- **Check**: Verify your database credentials in the `.env` file
- **Check**: Ensure your hosting provider allows external database connections
- **Check**: Verify the database server is accessible from your hosting IP

## Environment Variables Required

Make sure these are set in your `.env` file:
```
NODE_ENV=production
DB_HOST=your-database-host
DB_NAME=your-database-name
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
DB_PORT=1433
APP_NAME=YourAppName
VERSION=1.0.0
```

## Quick Test

If you want to test with a minimal setup first, temporarily replace your `dist/index.js` with the `test-deployment.js` file and update your `web.config` to point to it.

## Logs Location

Check the IIS logs at: `https://yourdomain.com/dist/iisnode/index.html`

This will show you detailed error information if something goes wrong. 