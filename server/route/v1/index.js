import express from 'express';
import authRouter from './auth';

const v1Router = express.Router();

v1Router.use(
  '/v1/',
  authRouter,
);

export default v1Router;
