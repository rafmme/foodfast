import validator from 'validator';
import { Food } from '../../models';

/**
 * @class OrderValidation
 */
export default class OrderValidation {
  /**
   * @description - Check if Order update data is correct
   * @param {object} req HTTP Request
   * @param {object} res HTTP Response
   * @param {object} next call next funtion/handler
   * @returns {object} returns res parameter
   */
  static validateOrderUpdateData(req, res, next) {
    const { status } = req.body;
    const expectedInput = ['New', 'Processing', 'Cancelled', 'Complete'];
    if (status === undefined) {
      return res.status(400).send({
        success: false,
        status: 400,
        error: {
          message: 'Status field is required'
        }
      });
    }
    if (!expectedInput.includes(status)) {
      return res.status(400).send({
        success: false,
        status: 400,
        error: {
          message: 'Invalid status input, expects one of [New, Processing, Complete or Cancelled]'
        }
      });
    }
    return next();
  }

  /**
 * @description - Validate Order Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
  static validateOrderInput(req, res, next) {
    const error = {};
    const {
      foodId,
      quantity,
      phoneNumber,
    } = req.body;
    // Check If foodId value is of type UUID/v4
    if (foodId && validator.isUUID(foodId, 4) === false) {
      error.foodId = 'Food ID is not a valid id';
    }
    // Check If quantity value is of type Number
    if (!Number.isSafeInteger(Number.parseInt(quantity, 10))) {
      error.quantity = 'Quantity of food to order is required, must be an integer';
    }
    if (phoneNumber && validator.isMobilePhone(phoneNumber, 'en-NG') === false) {
      error.phoneNumber = 'phoneNumber input isn\'t a valid mobile number';
    }
    // Sanitize and Validate Order input
    req.sanitizeBody('deliveryAddress').trim();
    req.sanitizeBody('phoneNumber').trim();
    req.checkBody(
      'phoneNumber',
      'phoneNumber is required'
    ).notEmpty().isString();
    req.checkBody(
      'foodId',
      'FoodId is required, must be of type UUID version 4'
    ).notEmpty().isString();
    req.checkBody(
      'deliveryAddress',
      'Delivery address is required, must not be less than 3 characters'
    ).notEmpty().trim().isLength({ min: 3 })
      .isString();
    const errors = req.validationErrors();
    if (errors) {
      errors.forEach((e) => {
        error[e.param] = e.msg;
      });
    }
    if (Object.keys(error).length >= 1) {
      return res.status(400).send({
        success: false,
        status: 400,
        error,
      });
    }
    return next();
  }

  /**
 * @description - Check if Food item exists before placing order
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
  static async verifyFoodExist(req, res, next) {
    const error = {};
    const { foodId } = req.body;
    try {
      const food = await Food.findById(foodId);

      if (!food) {
        error.foodId = `Order can't be placed because Food with ID ${foodId} doesn't exist`;
      }
      if (Object.keys(error).length >= 1) {
        return res.status(404).send({
          success: false,
          status: 404,
          error,
        });
      }
      return next();
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
