# IIS Deployment Guide

This guide covers deploying the Node.js API to IIS with proper environment variable configuration.

## Problem
The main issue is that IIS doesn't load `.env` files by default, and the `<aspNetCore>` section in `web.config` doesn't work for Node.js applications.

## Solutions

### Solution 1: IIS Application Pool Environment Variables (Recommended)

#### Option A: Using PowerShell Script
1. Run the provided PowerShell script as Administrator:
```powershell
.\scripts\setup-iis-env.ps1 -AppPoolName "YourAppPoolName"
```

#### Option B: Manual Setup in IIS Manager
1. Open IIS Manager
2. Go to **Application Pools**
3. Right-click on your Application Pool → **Advanced Settings**
4. Find **Environment Variables** and click **...**
5. Add each environment variable:
   - `NODE_ENV` = `production`
   - `DB_HOST` = `mssql001.use1.my-hosting-panel.com`
   - `DB_NAME` = `506software-mssqlserverdb-test`
   - `DB_USERNAME` = `defaultUser`
   - `DB_PASSWORD` = `tpp0Yk%JI4qybl^9`
   - `DB_PORT` = `1433`
   - `APP_NAME` = `MyNodeAPI`
   - `VERSION` = `1.0.0`
   - `JWT_SECRET` = `27da9a61247c72ed99fced796b7da69da795de08`
6. Click **OK** and restart the Application Pool

### Solution 2: Production .env File

#### Option A: Using PowerShell Script
```powershell
.\scripts\create-production-env.ps1
```

#### Option B: Manual Creation
1. Create a `.env` file in your production directory (`dist/.env`):
```env
NODE_ENV=production
DB_HOST=mssql001.use1.my-hosting-panel.com
DB_NAME=506software-mssqlserverdb-test
DB_USERNAME=defaultUser
DB_PASSWORD=tpp0Yk%JI4qybl^9
DB_PORT=1433
APP_NAME=MyNodeAPI
VERSION=1.0.0
JWT_SECRET=27da9a61247c72ed99fced796b7da69da795de08
```

### Solution 3: System Environment Variables

Set environment variables at the system level:
1. Open **System Properties** → **Environment Variables**
2. Add the variables to **System Variables**
3. Restart IIS

### Solution 4: Web.config Environment Variables (Alternative)

If the above solutions don't work, you can try this alternative `web.config` approach:

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="dist/index.js" verb="*" modules="iisnode" />
    </handlers>
    
    <iisnode
      nodeProcessCommandLine="node"
      debuggingEnabled="true"
      loggingEnabled="true"
      logDirectory="iisnode"
      devErrorsEnabled="true"
      node_env="production"
    />
    
    <!-- Alternative environment variable approach -->
    <httpProtocol>
      <customHeaders>
        <add name="X-NODE-ENV" value="production" />
        <add name="X-DB-HOST" value="mssql001.use1.my-hosting-panel.com" />
        <add name="X-DB-NAME" value="506software-mssqlserverdb-test" />
        <add name="X-DB-USERNAME" value="defaultUser" />
        <add name="X-DB-PASSWORD" value="tpp0Yk%JI4qybl^9" />
        <add name="X-DB-PORT" value="1433" />
        <add name="X-APP-NAME" value="MyNodeAPI" />
        <add name="X-VERSION" value="1.0.0" />
        <add name="X-JWT-SECRET" value="27da9a61247c72ed99fced796b7da69da795de08" />
      </customHeaders>
    </httpProtocol>
    
    <rewrite>
      <rules>
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^dist/index.js\/debug[\/]?" />
        </rule>
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="dist/index.js"/>
        </rule>
      </rules>
    </rewrite>
    
    <security>
      <requestFiltering>
        <hiddenSegments>
          <remove segment="bin"/>
        </hiddenSegments>
      </requestFiltering>
    </security>
    
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
```

## Deployment Steps

1. **Build the application:**
   ```bash
   npm run build
   ```

2. **Create production .env file:**
   ```powershell
   .\scripts\create-production-env.ps1
   ```

3. **Upload files to IIS:**
   - Upload the entire `dist` folder
   - Upload `web.config`
   - Upload `package.json` and `package-lock.json`

4. **Install dependencies on server:**
   ```bash
   npm install --production
   ```

5. **Set up environment variables** (choose one method from above)

6. **Restart Application Pool**

7. **Test the API**

## Troubleshooting

### Check Environment Variables
The application now includes debug logging. Check the IIS logs or console output for:
- Environment file path
- Environment variables status
- Database configuration validation

### Common Issues

1. **Environment variables undefined:**
   - Ensure Application Pool environment variables are set
   - Check if `.env` file exists in production directory
   - Verify file permissions

2. **Database connection errors:**
   - Verify database credentials
   - Check network connectivity to database server
   - Ensure database server allows connections from IIS server

3. **Permission issues:**
   - Ensure IIS Application Pool has necessary permissions
   - Check file system permissions for the application directory

### Debug Commands

Check if environment variables are loaded:
```powershell
# In PowerShell
Get-ChildItem Env: | Where-Object {$_.Name -like "*DB_*" -or $_.Name -like "*NODE_*"}
```

Check IIS logs:
- Look in `%SystemDrive%\inetpub\logs\LogFiles`
- Check `iisnode` logs in your application directory

## Security Notes

- Never commit `.env` files to version control
- Use strong passwords for database connections
- Consider using Azure Key Vault or similar for production secrets
- Regularly rotate JWT secrets and database passwords 