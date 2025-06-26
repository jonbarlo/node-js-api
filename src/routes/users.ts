import { Router } from 'express';
const userRouter = Router();
import { UserController } from "../controllers/userController";
import { authenticateToken } from '../middleware/auth';

userRouter.get('/users', authenticateToken, UserController.getAll);
export default userRouter;