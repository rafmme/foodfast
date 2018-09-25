import express from 'express';
import MenuController from '../../controllers/menu';
import { authenticateUser } from '../../middleware';

const menuRouter = express.Router();

menuRouter.get(
  '/menu/',
  authenticateUser,
  MenuController.getMenu
);

export default menuRouter;
