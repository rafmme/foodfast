import { User } from '../../models';

/**
 * @class UserValidation
 */
export default class UserValidation {
  /**
 * @description - Verify if User Exist
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
  static checkIfUserExist(req, res, next) {
    const { email } = req.body;
    User.find({ where: { email } }).then((user) => {
      if (user) {
        return res.status(409).send({
          success: false,
          status: 409,
          error: {
            message: `User with email ${email} already exists on the app, try logging in`
          }
        });
      }
      return next();
    }).catch(() => res.status(500).send({
      success: false,
      status: 500,
      error: {
        message: 'An error occured on the server',
      }
    }));
  }

  /**
 * @description - Validate User Sign Up data
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
  static validateSignUpData(req, res, next) {
    const error = {};
    req.sanitizeBody('fullname').trim();
    req.sanitizeBody('password').trim();
    req.sanitizeBody('email').trim();

    req.checkBody('fullname', 'Full Name is required, must be between 3-300 characters')
      .notEmpty().trim().isLength({ min: 3, max: 300 })
      .isString();
    req.checkBody('password', 'Password is required, must be between 8-20 characters')
      .notEmpty().trim().isLength({ min: 8, max: 20 })
      .isString();
    req.checkBody('email', 'Email is required, and must be a valid email')
      .isEmail().trim();
    const errors = req.validationErrors();
    if (errors) {
      errors.forEach((e) => {
        error[e.param] = e.msg;
      });
      return res.status(400).send({
        success: false,
        status: 400,
        error,
      });
    }
    return next();
  }

  /**
 * @description - Validate Sign in data
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
  static validateSignInData(req, res, next) {
    const error = {};
    req.sanitizeBody('password').trim();
    req.sanitizeBody('email').trim();

    req.checkBody('password', 'Password is required, must be between 8-20 characters')
      .notEmpty().trim().isLength({ min: 8, max: 20 })
      .isString();
    req.checkBody('email', 'Email is required, and must be a valid email')
      .isEmail().trim();
    const errors = req.validationErrors();
    if (errors) {
      errors.forEach((e) => {
        error[e.param] = e.msg;
      });
      return res.status(400).send({
        success: false,
        status: 400,
        error,
      });
    }
    return next();
  }
}
