import {
  generateToken,
  encryptPassword,
  checkIfPasswordMatch
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
  static createUser(req, res) {
    const {
      fullname,
      password,
      email
    } = req.body;
    const isAdmin = false;
    const signUpData = {
      fullname,
      email: email.toLowerCase(),
      password: encryptPassword(password.trim()),
      isAdmin
    };
    User.create(signUpData).then((user) => {
      const data = {
        userId: user.id,
        fullname,
        email
      };
      const token = generateToken({
        userId: user.id,
        isAdmin
      });
      return res.status(201).send({
        success: true,
        status: 201,
        message: 'User account created successfully',
        user: data,
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

  /**
    * @description handles signing in of users on the app
    * @param {*} req - Incoming Request object
    * @param {*} res - Incoming Message
    * @returns {object} res - Route response
    */
  static async loginUser(req, res) {
    const { email, password } = req.body;
    try {
      const user = await User.find({ where: { email: email.toLowerCase().trim() } });
      if (user) {
        if (checkIfPasswordMatch(user.password, password.trim())) {
          const data = {
            userId: user.id,
            isAdmin: user.isAdmin
          };
          const token = generateToken(data);
          return res.status(200).send({
            success: true,
            status: 200,
            message: 'User sign-in was successful',
            token,
          });
        }
        return res.status(400).send({
          success: false,
          status: 400,
          error: {
            message: 'Login failed! credentials not correct',
          }
        });
      } if (user === undefined) {
        return res.status(404).send({
          success: false,
          status: 404,
          error: {
            message: `Login failed! User ${email.trim()} does not exist on the app`,
          }
        });
      }
    } catch (err) {
      return res.status(500).send({
        success: false,
        status: 500,
        error: {
          message: 'An error occured on the server'
        }
      });
    }
  }
}

export default AuthController;
