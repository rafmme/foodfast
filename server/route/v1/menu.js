import express from 'express';
import MenuController from '../../controllers/menu';
import { authenticateUser, authorizeUser } from '../../middleware';
import FoodValidation from '../../helpers/validations/foodValidation';

const menuRouter = express.Router();

menuRouter.get(
  '/menu/',
  authenticateUser,
  MenuController.getMenu
).post(
  '/menu/',
  authenticateUser,
  authorizeUser,
  FoodValidation.validateFoodInput,
  FoodValidation.verifyFoodExist,
  MenuController.addMeal
);

export default menuRouter;
