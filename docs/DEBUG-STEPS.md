# Step-by-Step Debugging Guide

## Step 1: Test with Simple File
1. Upload the `dist/test-simple.js` file to your hosting
2. Temporarily rename your `web.config` to `web.config.backup`
3. Rename `web.config.test` to `web.config`
4. Try accessing: `https://node-js-api.506software.com/`
5. Check if you get a JSON response

## Step 2: Check IIS Logs
1. Go to: `https://node-js-api.506software.com/dist/iisnode/index.html`
2. Look for any error messages
3. Check the latest log files

## Step 3: Test Basic Setup
First, test the basic environment:
1. In Plesk console, run: `npm run test:basic`
2. This will check environment variables and file system
3. Make sure all required files exist and variables are set

## Step 4: Test Database Connection (MSSQL)
If Step 3 works, test your MSSQL connection:
1. In Plesk console, run: `npm run test:db`
2. This will test the database connection with detailed error messages
3. Check if it connects successfully

## Step 5: Environment Variables for MSSQL
Make sure these are set in your `.env` file:
```
NODE_ENV=production
DB_HOST=your-mssql-server-host
DB_NAME=your-mssql-database-name
DB_USERNAME=your-mssql-username
DB_PASSWORD=your-mssql-password
DB_PORT=1433
APP_NAME=YourAppName
VERSION=1.0.0
```

## Step 6: Common MSSQL Issues
1. **Port 1433 blocked** - Check if your hosting provider blocks port 1433
2. **SSL/TLS issues** - MSSQL might require SSL, but shared hosting often blocks it
3. **Firewall rules** - Your hosting provider might block external database connections
4. **Authentication mode** - Make sure your MSSQL server allows SQL authentication

## Step 7: Check File Permissions
1. Make sure `dist/index.js` has read permissions
2. Make sure `node_modules` folder is accessible
3. Check if all required files are uploaded

## Step 8: Test Database from Hosting
In Plesk console, try:
```bash
# Test if you can reach the database server
telnet your-database-host 1433

# Or use PowerShell
Test-NetConnection -ComputerName your-database-host -Port 1433
```

## Common Issues:
1. **Missing .env file** - Upload your .env file to the root directory
2. **Database connection blocked** - Check if your hosting provider blocks external connections
3. **File permissions** - Make sure IIS can read your files
4. **Missing dependencies** - Run `npm install --production` to install only production dependencies
5. **MSSQL SSL issues** - Try different SSL settings in database config

## Quick Test Commands:
In Plesk console, run:
```bash
cd /path/to/your/app
npm run test:basic
npm run test:db
```

## If Database Connection Fails:
1. Check if your MSSQL server allows remote connections
2. Verify the IP address of your hosting server is whitelisted
3. Try using a different port if 1433 is blocked
4. Contact your database provider to ensure external connections are allowed 