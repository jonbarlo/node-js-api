import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { config } from './config';
import userRouter from './routes/users';
import itemRouter from './routes/items';
//import { UserController } from './controllers/userController';

dotenv.config();
const app = express();

//import routes from './routes';
app.use(cors());
app.use(express.json());
//app.use('/api', routes);

app.use(userRouter);
app.use(itemRouter);

app.listen(config.port, () => {
    //  console.log(`Server is running on port ${PORT}`);
    logger(`${config.appName} is running on port ${config.port} - Version: ${config.version} - Environment: ${config.env || 'development'}`);
});


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