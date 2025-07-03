# Quick Deployment Checklist

## ✅ Pre-Deployment
- [ ] Build the application: `npm run build`
- [ ] Production `.env` file created in `dist/.env` ✅
- [ ] `web.config` updated (removed aspNetCore section) ✅
- [ ] Database configuration enhanced with better error handling ✅

## 🚀 Deployment Steps

### Option 1: IIS Application Pool Environment Variables (Recommended)
1. [ ] Open IIS Manager
2. [ ] Go to **Application Pools**
3. [ ] Right-click your Application Pool → **Advanced Settings**
4. [ ] Find **Environment Variables** and click **...**
5. [ ] Add these variables:
   - `NODE_ENV` = `production`
   - `DB_HOST` = `mssql001.use1.my-hosting-panel.com`
   - `DB_NAME` = `506software-mssqlserverdb-test`
   - `DB_USERNAME` = `defaultUser`
   - `DB_PASSWORD` = `tpp0Yk%JI4qybl^9`
   - `DB_PORT` = `1433`
   - `APP_NAME` = `MyNodeAPI`
   - `VERSION` = `1.0.0`
   - `JWT_SECRET` = `27da9a61247c72ed99fced796b7da69da795de08`
6. [ ] Click **OK**
7. [ ] Restart Application Pool

### Option 2: Production .env File (Alternative)
1. [ ] Upload `dist/.env` file to your production server
2. [ ] Ensure the file is in the same directory as your `dist/index.js`

## 📁 Files to Upload
- [ ] Entire `dist` folder (including `dist/.env`)
- [ ] `web.config`
- [ ] `package.json`
- [ ] `package-lock.json`

## 🔧 Server Setup
1. [ ] Run `npm install --production` on the server
2. [ ] Ensure IIS Node.js module is installed
3. [ ] Verify Application Pool is configured correctly

## 🧪 Testing
1. [ ] Test API endpoints
2. [ ] Check IIS logs for any errors
3. [ ] Verify database connection
4. [ ] Test authentication endpoints

## 🔍 Troubleshooting
If you still get "undefined" environment variables:

1. **Check IIS Application Pool:**
   - Verify environment variables are set correctly
   - Restart the Application Pool

2. **Check .env file:**
   - Ensure `dist/.env` exists on the server
   - Verify file permissions

3. **Check logs:**
   - Look at IIS logs in `%SystemDrive%\inetpub\logs\LogFiles`
   - Check `iisnode` logs in your application directory

4. **Debug output:**
   - The application now includes detailed debug logging
   - Check console output for environment variable status

## 📞 Quick Commands
```powershell
# Check environment variables in PowerShell
Get-ChildItem Env: | Where-Object {$_.Name -like "*DB_*" -or $_.Name -like "*NODE_*"}

# Restart Application Pool
Restart-WebAppPool -Name "YourAppPoolName"

# Check if .env file exists
Test-Path "C:\path\to\your\app\dist\.env"
```

## 🎯 Expected Result
After deployment, you should see in the logs:
```
[Database Config] Environment file path: C:\path\to\your\app\dist\.env
[Database Config] NODE_ENV: production
[Database Config] DB_HOST: mssql001.use1.my-hosting-panel.com
[Database Config] DB_NAME: 506software-mssqlserverdb-test
[Database Config] DB_USERNAME: defaultUser
[Database Config] DB_PASSWORD: [SET]
Database connection has been established successfully.
``` 