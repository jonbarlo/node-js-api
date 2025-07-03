# Deployment Guide

## Quick Deployment Commands

### FTP Deployment (Recommended)
```bash
npm run deploy:ftp
```
This automatically uploads files and copies `.env.prod` to `.env` on the server.

### Manual Deployment
```bash
npm run deploy:full
```
This creates a deployment package in the `deployment-full/` folder.

## Environment Variables Setup

### For FTP Deployment (Recommended)
The FTP deployment automatically handles environment files:

1. **Keep `.env` for development** - contains your local development settings
2. **Create `.env.prod` for production** - contains your production settings
3. **The deployment script** automatically copies `.env.prod` to `.env` on the server

### Example `.env.prod` file:
```env
# Production Environment Variables
NODE_ENV=production
APP_NAME=NodeJS API
VERSION=1.0.0

# Database (MSSQL for production)
DB_HOST=your-mssql-server.com
DB_NAME=your-production-database
DB_USERNAME=your-database-username
DB_PASSWORD=your-database-password
DB_PORT=1433

# JWT (if using authentication)
JWT_SECRET=your-jwt-secret-key
JWT_EXPIRES_IN=24h

# Server
PORT=3031

# FTP Configuration (for deployment)
FTP_HOST=your-ftp-server.com
FTP_USER=your-ftp-username
FTP_PASSWORD=your-ftp-password
FTP_PORT=21
FTP_SECURE=false
FTP_REMOTE_PATH=/
```

## Deployment Process

### Step 1: Prepare Environment Files
- Ensure `.env.prod` exists with production values
- Keep `.env` for local development

### Step 2: Run FTP Deployment
```bash
npm run deploy:ftp
```

### Step 3: Server Setup (in Plesk Console)
```bash
npm install
npm run build
npm run test:basic
npm run test:minimal
npm run test:db
npm start
```

## What Gets Uploaded

### Files Uploaded
- `src/` folder (TypeScript source files)
- `package.json` and `package-lock.json`
- `web.config` (IIS configuration)
- `tsconfig.json` (TypeScript configuration)
- Documentation files

### Environment Handling
- `.env.prod` is automatically copied to `.env` on the server
- No need to manually update environment files

## Benefits of This Approach

### Before
- Manually update `.env` file before each deployment
- Risk of accidentally deploying development settings
- Need to remember to change environment variables

### After
- Separate development and production environments
- Automatic environment file handling
- No risk of deploying wrong settings
- Cleaner workflow

## Troubleshooting

### Missing .env.prod File
If you get a warning about missing `.env.prod`:
1. Copy `env.prod.example` to `.env.prod`
2. Fill in your production values
3. Run deployment again

### Environment Variables Not Loading
1. Check that `.env.prod` exists and has correct values
2. Verify the deployment copied the file correctly
3. Run `npm run test:basic` to check environment loading

## Security Notes

- Never commit `.env.prod` to version control
- Use strong, unique passwords for production
- Keep your `.env.prod` file secure
- Consider using environment variables in your hosting control panel instead

## Alternative: Manual Environment Setup

If you prefer to set environment variables in your hosting control panel:
1. Don't include `.env.prod` in deployment
2. Set environment variables in Plesk/IIS
3. The application will use system environment variables 