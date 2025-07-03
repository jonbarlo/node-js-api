# Deployment Testing - Current Status

## Current Testing Approach

**Date**: July 2, 2025
**Issue**: Node.js app works with `npm start` but crashes in IIS with 500 error

## What We're Testing

### Problem Summary
- ✅ Node.js app starts successfully with `npm start` in Plesk console
- ✅ Database connection works fine
- ❌ IIS returns 500 error when trying to access the app
- ❌ No error logs available due to IIS permissions issues

### Current Testing Strategy
1. **Using minimal web.config** (`web.config.minimal`) instead of full config
2. **Using minimal test file** (`dist/test-minimal.js`) to isolate the issue
3. **Disabled logging** to avoid permission issues
4. **Added --no-deprecation flag** to suppress Buffer warnings

### Files Being Deployed
- `web.config.minimal` → rename to `web.config` on server
- `dist/test-minimal.js` → simple Express app for testing
- All source files and dependencies

### Test URLs
- `https://node-js-api.506software.com/` (should use minimal test)
- `https://node-js-api.506software.com/health` (health endpoint)

## Expected Results

### If Minimal Test Works
- ✅ IIS can run Node.js applications
- ❌ Issue is with the main application code
- Next step: Debug the main application

### If Minimal Test Fails
- ❌ IIS has fundamental issues with Node.js
- Next step: Check IIS configuration or hosting provider support

## Deployment Command
```bash
npm run deploy:ftp
```

## Server Setup (After Deployment)
```bash
npm install
npm run build
# Test the minimal app
```

## Notes
- This is a temporary testing approach
- Once we identify the issue, we'll revert to the full web.config
- The minimal test has no database dependencies to isolate the issue 