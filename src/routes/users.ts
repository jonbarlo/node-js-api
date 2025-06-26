import { Router } from 'express';
const userRouter = Router();
import { UserController } from "../controllers/userController";
userRouter.get('/users', UserController.getAll);
export default userRouter;