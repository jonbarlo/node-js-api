import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export class ItemController {

    // regular function
    public static async getAll(req: Request, res: Response) 
    {
        logger('API endpoint /items was called...');
        res.send('List of items');
    }
}