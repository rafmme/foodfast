import express from 'express';
import MenuController from '../../controllers/menu';
import { authenticateUser, authorizeUser } from '../../middleware';
import FoodValidation from '../../helpers/validations/foodValidation';
import { validateIdParam } from '../../helpers/utils';

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
).delete(
  '/menu/:id',
  authenticateUser,
  authorizeUser,
  validateIdParam,
  MenuController.deleteMeal
).put(
  '/menu/:id',
  authenticateUser,
  authorizeUser,
  validateIdParam,
  FoodValidation.validateEditFoodData,
  FoodValidation.validateFoodInput,
  FoodValidation.verifyEditFoodExist,
  MenuController.editMeal
)
  .get(
    '/menu/:id',
    authenticateUser,
    validateIdParam,
    MenuController.getAMeal
  );

export default menuRouter;
