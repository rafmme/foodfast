import express from 'express';
import authRouter from './auth';
import menuRouter from './menu';

const v1Router = express.Router();

v1Router.use(
  '/v1/',
  authRouter,
  menuRouter
);

export default v1Router;
