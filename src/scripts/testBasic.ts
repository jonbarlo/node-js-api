import express from 'express';

console.log('=== Basic IIS Test App Starting ===');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());
console.log('Environment:', process.env.NODE_ENV || 'development');

const app = express();

// Basic middleware
app.use(express.json());

// Test endpoints
app.get('/', (req, res) => {
    console.log('Root endpoint called');
    res.json({ 
        message: 'Basic IIS test app is working!', 
        timestamp: new Date().toISOString(),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        note: 'This app is running behind IIS without a port'
    });
});

app.get('/health', (req, res) => {
    console.log('Health endpoint called');
    res.json({ 
        status: 'OK', 
        message: 'Health check passed',
        timestamp: new Date().toISOString()
    });
});

app.get('/test', (req, res) => {
    console.log('Test endpoint called');
    res.json({ 
        message: 'Test endpoint works!',
        headers: req.headers,
        timestamp: new Date().toISOString()
    });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message
    });
});

console.log('✅ App ready for IIS - no server startup needed');
console.log('✅ IIS will handle all requests automatically');
console.log('=== Basic IIS Test App Ready ===');

// Export for IIS use
export default app; 