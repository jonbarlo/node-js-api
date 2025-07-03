# FTP Setup Guide

## Overview
This guide explains how to set up automated FTP deployment for your Node.js API.

## Required FTP Information

You'll need the following information from your hosting provider:

### Essential Information
- **FTP Host/Server**: The FTP server address (e.g., `ftp.yourdomain.com` or `yourdomain.com`)
- **FTP Username**: Your FTP username
- **FTP Password**: Your FTP password

### Optional Information
- **FTP Port**: Usually 21 (default) or 22 for SFTP
- **FTP Secure**: Whether to use FTPS (true/false)
- **Remote Path**: The directory on the server where files should be uploaded (usually `/` or `/public_html`)

## Setting Up Environment Variables

Add these variables to your `.env` file:

```env
# FTP Configuration
FTP_HOST=your-ftp-server.com
FTP_USER=your-username
FTP_PASSWORD=your-password
FTP_PORT=21
FTP_SECURE=false
FTP_REMOTE_PATH=/
```

### Example Configuration
```env
# For a typical shared hosting setup
FTP_HOST=node-js-api.506software.com
FTP_USER=your-username
FTP_PASSWORD=your-password
FTP_PORT=21
FTP_SECURE=false
FTP_REMOTE_PATH=/public_html
```

## Getting FTP Information

### From Your Hosting Provider (Mochahost)
1. **Log into your hosting control panel** (Plesk, cPanel, etc.)
2. **Look for FTP accounts** or **File Manager**
3. **Create or find your FTP credentials**
4. **Note the FTP server address** (usually your domain name)

### Common FTP Server Formats
- `ftp.yourdomain.com`
- `yourdomain.com`
- `server123.hostingprovider.com`

## Testing FTP Connection

Before running the deployment script, you can test your FTP connection:

### Using Cyberduck or FileZilla
1. Open your FTP client
2. Enter the FTP credentials
3. Try to connect and browse files
4. If successful, your credentials are correct

### Using Command Line (Optional)
```bash
# Test FTP connection
ftp your-ftp-server.com
# Enter username and password when prompted
```

## Running FTP Deployment

Once your `.env` file is configured:

```bash
# Install the FTP dependency
npm install

# Run FTP deployment
npm run deploy:ftp
```

## What the FTP Deployment Does

1. **Builds your project** (compiles TypeScript)
2. **Creates a deployment package** with all necessary files
3. **Connects to your FTP server** using the credentials
4. **Uploads all files** to the specified remote directory
5. **Provides detailed feedback** about the upload process

## Troubleshooting FTP Issues

### Connection Refused
- Check if the FTP server address is correct
- Verify the port number (21 for FTP, 22 for SFTP)
- Ensure your hosting provider allows FTP connections

### Authentication Failed
- Double-check username and password
- Make sure the FTP account is active
- Try logging in with an FTP client first

### Upload Permission Denied
- Check if the remote directory exists
- Verify you have write permissions
- Contact your hosting provider if needed

### Files Not Uploading
- Check available disk space on the server
- Verify the remote path is correct
- Look for any firewall restrictions

## Security Considerations

### Keep Credentials Secure
- Never commit your `.env` file to version control
- Use strong, unique passwords for FTP
- Consider using SFTP (FTP_SECURE=true) if available

### Environment File Security
```bash
# Make sure .env is in your .gitignore
echo ".env" >> .gitignore
```

## Alternative: Manual Upload

If FTP deployment doesn't work, you can still use the manual deployment:

```bash
# Create deployment package
npm run deploy:full

# Upload the 'deployment-full' folder manually via Cyberduck
```

## Support

If you encounter issues:
1. Check the error messages in the deployment script
2. Verify your FTP credentials with your hosting provider
3. Test the connection manually first
4. Contact your hosting provider for FTP support 