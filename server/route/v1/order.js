import express from 'express';
import OrderController from '../../controllers/order';
import { authenticateUser, authorizeUser } from '../../middleware';

const orderRouter = express.Router();

orderRouter.get(
  '/orders/',
  authenticateUser,
  authorizeUser,
  OrderController.getAllOrders
);

export default orderRouter;
