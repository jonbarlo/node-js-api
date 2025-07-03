import dotenv from 'dotenv';
import path from 'path';
import config from './services/configService';
console.log('INDEX DEBUG:', config);

// Load environment variables from .env file FIRST
const envPath = path.resolve(process.cwd(), '.env');
dotenv.config({ path: envPath });

import express from 'express';
import cors from 'cors';
import { logger } from './utils/logger';
import { sequelize } from './config/database';
import userRouter from './routes/users';
import itemRouter from './routes/items';
import authRouter from './routes/auth';
//import { UserController } from './controllers/userController';

logger(`Environment variables loaded from ${envPath}`);
logger(`Environment Loaded: ${config.NODE_ENV}`);

// Debug: Log all environment variables
logger('=== ALL ENVIRONMENT VARIABLES ===');
Object.keys(process.env).forEach(key => {
  if (key.includes('DB_') || key.includes('NODE_') || key.includes('APP_') || key.includes('JWT_')) {
    logger(`${key}: ${process.env[key]}`);
  }
});
logger('=== END ENVIRONMENT VARIABLES ===');

// logger(`- DB_USERNAME: ${process.env.DB_USERNAME}`);
// logger(`- DB_NAME: ${process.env.DB_NAME}`);
// logger(`- DB_HOST: ${process.env.DB_HOST}`);
// logger(`- DB_PORT: ${process.env.DB_PORT}`);
// logger(`- DB_URL: ${process.env.DB_URL}`);

// logger(`- APP_NAME: ${process.env.APP_NAME}`);
// logger(`- VERSION: ${process.env.VERSION}`);
// logger(`- PORT: ${process.env.PORT}`);
// logger(`- NODE_ENV: ${process.env.NODE_ENV}`);

const app = express();

//import routes from './routes';
app.use(cors());
app.use(express.json());
//app.use('/api', routes);

// Add a health check endpoint for IIS
app.get('/health', (req, res) => {
    logger('Health check endpoint called');
    res.status(200).json({ 
        status: 'OK', 
        message: 'API is running',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

// Add a root endpoint
app.get('/', (req, res) => {
    logger('Root endpoint called');
    res.status(200).json({ 
        message: 'Node.js API is running',
        environment: config.NODE_ENV,
        version: process.env.VERSION || '1.0.0'
    });
});

// Add a simple test endpoint that doesn't require database
app.get('/test', (req, res) => {
    logger('Test endpoint called');
    res.status(200).json({ 
        message: 'Test endpoint works!',
        environment: config.NODE_ENV,
        timestamp: new Date().toISOString(),
        note: 'This endpoint works without database access'
    });
});

app.use('/auth', authRouter);
app.use(userRouter);
app.use(itemRouter);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger(`Error occurred: ${err.message}`);
    logger(`Stack trace: ${err.stack}`);
    res.status(500).json({ 
        error: 'Internal Server Error',
        message: err.message,
        environment: config.NODE_ENV
    });
});

// Database connection and server startup
const startServer = async () => {
    try {
        // Log startup conditions
        logger(`=== SERVER STARTUP ===`);
        logger(`NODE_ENV: ${config.NODE_ENV}`);
        logger(`PORT: ${process.env.PORT || 'NOT SET'}`);
        logger(`APP_NAME: ${process.env.APP_NAME}`);
        logger(`VERSION: ${process.env.VERSION}`);
        
        // Test database connection
        await sequelize.authenticate();
        logger('Database connection has been established successfully.');

        // Sync database (in development)
        if (config.NODE_ENV === 'development') {
            await sequelize.sync({ alter: true });
            logger('Database synchronized.');
        }

        // Start server if PORT is provided (Railway, Heroku, etc.) or in development
        if (process.env.PORT || config.NODE_ENV === 'development') {
            const port = process.env.PORT || 3031;
            logger(`Starting server on port ${port}...`);
            app.listen(port, () => {
                logger(`✅ ${process.env.APP_NAME || 'Node.js API'} is running on port ${port} - Version: ${process.env.VERSION || '1.0.0'} - Environment: ${process.env.NODE_ENV || 'development'}`);
                logger(`✅ Health check available at: http://localhost:${port}/health`);
            });
        } else {
            // IIS mode - export app for iisnode
            logger(`📋 ${process.env.APP_NAME || 'Node.js API'} is ready for IIS - Version: ${process.env.VERSION || '1.0.0'} - Environment: ${process.env.NODE_ENV}`);
            logger(`📋 No PORT set, exporting app for iisnode`);
        }
    } catch (error) {
        logger(`❌ Database connection failed: ${error}`);
        logger('Starting server without database connection...');
        
        // Start server even if database fails (for testing)
        if (process.env.PORT || config.NODE_ENV === 'development') {
            const port = process.env.PORT || 3031;
            logger(`Starting server on port ${port} (NO DATABASE)...`);
            app.listen(port, () => {
                logger(`✅ ${process.env.APP_NAME || 'Node.js API'} is running on port ${port} (NO DATABASE) - Version: ${process.env.VERSION || '1.0.0'} - Environment: ${process.env.NODE_ENV || 'development'}`);
                logger(`✅ Health check available at: http://localhost:${port}/health`);
            });
        } else {
            // IIS mode - export app for iisnode
            logger(`📋 ${process.env.APP_NAME || 'Node.js API'} is ready for IIS (NO DATABASE) - Version: ${process.env.VERSION || '1.0.0'} - Environment: ${process.env.NODE_ENV}`);
            logger(`📋 No PORT set, exporting app for iisnode`);
        }
    }
};

logger('🚀 About to start server...');
startServer();
logger('🚀 startServer() called - check if it executed properly');

// Fallback: If PORT is set, ensure server starts (for Railway)
if (process.env.PORT) {
    const port = process.env.PORT;
    logger(`🔄 Fallback: Starting server on port ${port}...`);
    app.listen(port, () => {
        logger(`✅ FALLBACK: Server is running on port ${port}`);
        logger(`✅ Health check available at: http://localhost:${port}/health`);
    });
}

// Export the app for IIS
export default app;

// app.get('/items', (req: Request, res: Response) => {
//     res.json(items);
// });

// app.get('/items', (req: Request, res: Response) => {
//     logger('API endpoint /items was called...');
//     const { name } = req.query;
//     const filteredItems = name ? items.filter(item => item.name.includes(name as string)) : items;
//     res.json(filteredItems);
// });

// app.post('/items', (req: Request, res: Response) => {
//     const item: Item = req.body;
//     items.push(item);
//     res.status(201).json(item);
// });

// app.use((err: any, req: Request, res: Response, next: Function) => {
//     console.error(err.stack);
//     res.status(500).send('Something broke!');
// });