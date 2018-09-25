import express from 'express';
import authRouter from './auth';
import menuRouter from './menu';
import orderRouter from './order';

const v1Router = express.Router();

v1Router.use(
  '/v1/',
  authRouter,
  menuRouter,
  orderRouter
);

export default v1Router;
