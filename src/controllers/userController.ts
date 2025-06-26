import { Request, Response, RequestHandler } from 'express';
import { logger } from '../utils/logger';

export class UserController {

    // regular function
    public static getAll: RequestHandler = async (req: Request, res: Response) => {
        logger('API endpoint /users was called...');
        res.send('List of users');
    };
}