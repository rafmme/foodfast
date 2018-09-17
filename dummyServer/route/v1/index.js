import express from 'express';
import orderRouter from './order';

const v1Router = express.Router();

v1Router.use(
  '/v1/',
  orderRouter
);

export default v1Router;
