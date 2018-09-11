import express from 'express';
import OrderController from '../../controller/order';
import validateId from '../../helpers/utils';
import OrderValidation from '../../helpers/orderValidation';

const orderRouter = express.Router();

orderRouter.get('/orders/', OrderController.getAllOrders)
  .get('/orders/:id', validateId, OrderController.getOrder)
  .post(
    '/orders/',
    OrderValidation.validateOrderInput,
    OrderValidation.verifyFoodAndUser,
    OrderController.placeOrder
  );

export default orderRouter;
