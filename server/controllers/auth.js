import {
  generateToken,
  encryptPassword
} from '../helpers/utils';
import { User } from '../models';

/**
 * @class AuthController
 */
class AuthController {
  /**
     * @description handles creation/addition of new user on the app
     * @param {*} req - Incoming Request object
     * @param {*} res - Incoming Message
     * @returns {object} res - Route response
     */
  static async createUser(req, res) {
    const {
      fullname,
      password,
      email
    } = req.body;
    const isAdmin = false;
    const signUpData = {
      fullname,
      email,
      password: encryptPassword(password.trim()),
      isAdmin
    };
    User.create(signUpData).then((user) => {
      const tokenData = {
        userId: user.id,
        email: user.email,
        fullname: user.fullname,
        isAdmin
      };
      const token = generateToken(tokenData);
      user.password = '**********';
      return res.status(201).send({
        success: true,
        status: 201,
        message: 'User account created successfully',
        user,
        token,
      });
    }).catch(() => res.status(500).send({
      success: false,
      status: 500,
      error: {
        message: 'An error occured on the server'
      }
    }));
  }
}

export default AuthController;
