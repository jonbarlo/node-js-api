import express from 'express';
import cors from 'cors';
import path from 'path';
import { logger } from './utils/logger';
import { config } from './config';
import { sequelize } from './config/database';
import userRouter from './routes/users';
import itemRouter from './routes/items';
import authRouter from './routes/auth';
//import { UserController } from './controllers/userController';

// Load environment variables from .env file
const envPath = path.resolve(process.cwd(), '.env');
logger(`Environment variables loaded from ${envPath}`);
logger(`Environment Loaded: ${config.env}`);
logger(`DB Loaded: ${process.env.DB_USERNAME}`);
logger(`DB Loaded: ${process.env.DB_NAME}`);
logger(`DB Loaded: ${process.env.DB_HOST}`);

const app = express();

//import routes from './routes';
app.use(cors());
app.use(express.json());
//app.use('/api', routes);

app.use('/auth', authRouter);
app.use(userRouter);
app.use(itemRouter);

// Database connection and server startup
const startServer = async () => {
    try {
        // Test database connection
        await sequelize.authenticate();
        logger('Database connection has been established successfully.');

        // Sync database (in development)
        if (config.env === 'development') {
            await sequelize.sync({ alter: true });
            logger('Database synchronized.');
        }

        // Start server
        app.listen(config.port, () => {
            logger(`${config.appName} is running on port ${config.port} - Version: ${config.version} - Environment: ${config.env || 'development'}`);
        });
    } catch (error) {
        logger(`Unable to connect to the database: ${error}`);
        process.exit(1);
    }
};

startServer();

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