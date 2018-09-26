import express from 'express';
import OrderController from '../../controllers/order';
import { authenticateUser, authorizeUser } from '../../middleware';
import { validateIdParam } from '../../helpers/utils';

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
);

export default orderRouter;
