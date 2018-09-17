import express from 'express';
import OrderController from '../../controller/order';
import validateId from '../../helpers/utils';

const orderRouter = express.Router();

orderRouter.get('/orders/', OrderController.getAllOrders)
  .get('/orders/:id', validateId, OrderController.getOrder);

export default orderRouter;
