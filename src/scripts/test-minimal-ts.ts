console.log('FRESH DEBUG MARKER: 2025-07-02-01');
const express = require('express');

// Import the centralized configuration service
const config = require('../services/configService').default;

console.log('=== Minimal TypeScript Test Starting ===');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Environment:', config.NODE_ENV);
console.log('App:', config.APP_NAME, 'v' + config.VERSION);

const app = express();

app.get('/', (req: any, res: any) => {
    console.log('Root endpoint called');
    res.json({ 
        message: 'Minimal TypeScript test works!', 
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        environment: config.NODE_ENV,
        appName: config.APP_NAME,
        version: config.VERSION
    });
});

app.get('/health', (req: any, res: any) => {
    console.log('Health endpoint called');
    res.json({ 
        status: 'OK', 
        message: 'Health check passed',
        timestamp: new Date().toISOString(),
        environment: config.NODE_ENV,
        database: {
            host: config.DB_HOST,
            database: config.DB_NAME,
            username: config.DB_USERNAME,
            port: config.DB_PORT
        }
    });
});

// For development testing only - remove this in production
if (config.NODE_ENV === 'development') {
    const port = config.PORT;
    app.listen(port, () => {
        console.log(`✅ Minimal TypeScript server running on port ${port}`);
        console.log(`✅ Test URLs:`);
        console.log(`   http://localhost:${port}/`);
        console.log(`   http://localhost:${port}/health`);
        console.log('=== Minimal TypeScript Test Ready ===');
    });
} else {
    console.log('✅ App ready for IIS - no server startup needed');
    console.log('✅ IIS will handle all requests automatically');
}

// Export for IIS use
module.exports = app; 