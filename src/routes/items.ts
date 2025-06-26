import { Router } from 'express';
const itemRouter = Router();
import { ItemController } from "../controllers/itemController";
itemRouter.get('/items', ItemController.getAll);
export default itemRouter;