import express from 'express';
import AuthController from '../../controllers/auth';
import UserValidation from '../../helpers/validations/userValidation';

const authRouter = express.Router();

authRouter.post(
  '/auth/signup',
  UserValidation.validateSignUpData,
  UserValidation.checkIfUserExist,
  AuthController.createUser
);

export default authRouter;
