/**
 * @description Check if request id param is integer
 * @param {object} req HTTP Request
 * @param {object} res HTTP Response
 * @param {object} next call next funtion/handler
 * @returns {object} returns res parameter
 */
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (Number.isSafeInteger(Number.parseInt(id, 10))) {
    return next();
  }
  return res.status(400).send({
    success: false,
    status: 400,
    error: {
      message: 'expects ID param to be an integer'
    }
  });
};

export default validateId;
