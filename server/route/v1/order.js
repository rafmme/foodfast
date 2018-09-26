import express from 'express';
import OrderController from '../../controllers/order';
import { authenticateUser, authorizeUser } from '../../middleware';
import { validateIdParam } from '../../helpers/utils';
import OrderValidation from '../../helpers/validations/orderValidation';

const orderRouter = express.Router();

orderRouter.get(
  '/orders/',
  authenticateUser,
  authorizeUser,
  OrderController.getAllOrders
).get(
  '/orders/:id',
  authenticateUser,
  authorizeUser,
  validateIdParam,
  OrderController.getOrder
).put(
  '/orders/:id',
  authenticateUser,
  authorizeUser,
  validateIdParam,
  OrderValidation.validateOrderUpdateData,
  OrderController.updateOrder
);

export default orderRouter;
