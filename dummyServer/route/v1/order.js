import express from 'express';
import OrderController from '../../controller/order';

const orderRouter = express.Router();

orderRouter.get('/orders/', OrderController.getAllOrders);

export default orderRouter;
