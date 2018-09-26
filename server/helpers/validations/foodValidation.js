import { Food } from '../../models';

/**
 * @class FoodValidation
 */
export default class FoodValidation {
  /**
 * @description - Validate Food Input
 *
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
  static validateFoodInput(req, res, next) {
    const error = {};
    const { price } = req.body;
    // Check If price value is of type Number
    if (!Number.isSafeInteger(Number.parseInt(price, 10))) {
      error.price = 'Price of food item is required, must be an integer';
    }
    // Sanitize and Validate food title and description input
    req.sanitizeBody('title').trim();
    req.sanitizeBody('description').trim();
    req.checkBody(
      'title',
      'Food item title is required, must be within the range of 3 - 150 characters'
    ).notEmpty().trim().isLength({ min: 3, max: 150 })
      .isString();
    req.checkBody(
      'description',
      'Food item description is required, must be within the range of 3 - 300 characters'
    ).notEmpty().trim().isLength({ min: 3, max: 3000 })
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
 * @description - Check if Food item exists before adding
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
  static async verifyFoodExist(req, res, next) {
    const { title } = req.body;
    try {
      const food = await Food.find({ where: { title: title.trim() } });
      if (food) {
        return res.status(409).send({
          success: false,
          status: 409,
          error: {
            message: `Food item ${title.trim()} already exist on the app`
          }
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
