import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export class UserController {

    // regular function
    public static async getAll(req: Request, res: Response) 
    {
        logger('API endpoint /users was called...');
        res.send('List of users');
    }
}