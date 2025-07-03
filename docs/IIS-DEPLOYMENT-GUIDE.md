# IIS Node.js Deployment Guide

## How IIS + Node.js Works

When deploying Node.js applications on IIS shared hosting, the architecture is different from traditional Node.js hosting:

### Traditional Node.js Hosting
```
Client → Node.js Server (port 3000) → Response
```

### IIS + Node.js Hosting
```
Client → IIS (port 80/443) → iisnode → Node.js App (no port) → Response
```

## Key Points for IIS Hosting

### 1. No Port Specification in Production
Your Node.js app should **NOT** start an HTTP server in production. IIS handles this:

```typescript
// ✅ CORRECT for IIS
if (config.env === 'development') {
    const port = process.env.PORT || 3031;
    app.listen(port, () => {
        logger(`Server running on port ${port}`);
    });
} else {
    // Production: Just export the app, let IIS handle it
    logger('App ready for IIS - no server startup needed');
}

export default app;
```

### 2. IIS Configuration
The `web.config` file tells IIS how to handle requests:

```xml
<!-- All requests go to your Node.js app -->
<rule name="NodeApp" stopProcessing="true">
  <match url=".*" />
  <conditions logicalGrouping="MatchAll">
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
    <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
  </conditions>
  <action type="Rewrite" url="dist/index.js" />
</rule>
```

### 3. Port Assignment
- **IIS** runs on standard ports (80/443)
- **Your Node.js app** runs without a port
- **iisnode** handles communication between IIS and your app
- **No port conflicts** because your app doesn't bind to any port

## Common Issues and Solutions

### Issue: "Cannot start server on port X"
**Cause**: Trying to start an HTTP server in production
**Solution**: Remove `app.listen()` calls in production mode

### Issue: "Port already in use"
**Cause**: Another application using the same port
**Solution**: Don't specify ports in production - let IIS handle it

### Issue: "Connection refused"
**Cause**: App trying to connect to itself on a specific port
**Solution**: Use relative URLs or let IIS handle routing

## Testing Your Setup

### 1. Local Development Test
```bash
npm run test:basic
# This will start a server locally for testing
```

### 2. Production Build Test
```bash
npm run build
# This creates dist/index.js without starting a server
```

### 3. IIS Deployment
1. Upload `dist/` folder
2. Upload `web.config`
3. Upload `node_modules/` (or run `npm install` on server)
4. Set `NODE_ENV=production`
5. IIS will automatically route requests to your app

## Why This Works

1. **IIS handles HTTP**: Manages ports, SSL, load balancing
2. **iisnode bridges**: Connects IIS to your Node.js app
3. **Your app focuses**: Just handles business logic, not HTTP server management
4. **No conflicts**: Multiple apps can run on same server without port issues

## Best Practices

1. **Environment detection**: Always check `NODE_ENV` before starting servers
2. **Export the app**: Always export your Express app for IIS
3. **Error handling**: Use proper error middleware
4. **Logging**: Use console.log for debugging (IIS captures this)
5. **Health checks**: Include `/health` endpoints for monitoring

## Troubleshooting

### Check IIS Logs
- Look in your hosting control panel for error logs
- Check the `logDirectory` specified in `web.config`

### Test Minimal App
```bash
npm run test:basic
# This creates a minimal app for testing
```

### Verify Configuration
- Ensure `web.config` points to correct file (`dist/index.js`)
- Check that `iisnode` module is installed on server
- Verify `NODE_ENV=production` is set

This architecture is standard for shared hosting providers and allows multiple Node.js apps to run on the same server without port conflicts. 