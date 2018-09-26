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
}
