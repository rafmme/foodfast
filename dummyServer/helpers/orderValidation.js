import foods from '../model/foods';
import users from '../model/users';

/**
 * @class OrderValidation
 */
export default class OrderValidation {
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
      customerId,
    } = req.body;
    // Check If foodId value is of type Number
    if (!Number.isSafeInteger(Number.parseInt(foodId, 10))) {
      error.foodId = 'Food ID is required, must be an integer';
    }
    // Check If quantity value is of type Number
    if (!Number.isSafeInteger(Number.parseInt(quantity, 10))) {
      error.quantity = 'Quantity of food to order is required, must be an integer';
    }
    // Check If customerId value is of type Number
    if (!Number.isSafeInteger(Number.parseInt(customerId, 10))) {
      error.customerId = 'Customer ID is required, must be an integer';
    }
    // Sanitize and Validate deliveryAddress and phoneNumber input
    req.sanitizeBody('deliveryAddress').trim();
    req.sanitizeBody('phoneNumber').trim();
    req.checkBody(
      'deliveryAddress',
      'Delivery address is required, must not be less than 3 characters'
    ).notEmpty().trim().isLength({ min: 3 })
      .isString();
    req.checkBody(
      'phoneNumber',
      'Phone Number is required and must be of 11 characters'
    ).notEmpty().trim().isLength({ min: 11, max: 11 })
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
 * @description - Check if User and Food item exists before placing order
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
  static verifyFoodAndUser(req, res, next) {
    const error = {};
    const {
      foodId,
      customerId
    } = req.body;

    const foodItem = foods.find(food => (food.id === Number.parseInt(foodId, 10)));
    const customer = users.find(user => (user.id === Number.parseInt(customerId, 10)));

    if (!foodItem) {
      error.foodId = `Order can't be placed because Food with ID ${foodId} doesn't exist`;
    }
    if (!customer) {
      error.customerId = `Order can't be placed because User with ID ${customerId} doesn't exist`;
    }

    if (Object.keys(error).length >= 1) {
      return res.status(404).send({
        success: false,
        status: 404,
        error,
      });
    }
    return next();
  }

  /**
 * @description - Check if Order update data is correct
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
  static validateOrderUpdateData(req, res, next) {
    const { status } = req.body;
    const expectedInput = ['pending', 'accepted', 'canceled', 'completed'];
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
          message: 'Invalid status input, expects one of [pending,canceled,completed or accepted]'
        }
      });
    }
    return next();
  }
}
