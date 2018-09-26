import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticateUser = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({
      success: false,
      status: 401,
      error: {
        message: 'You are not logged in, Token is needed!'
      }
    });
  }
  const token = authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (decoded) {
      req.user = decoded;
      return next();
    }
    return res.status(401).send({
      success: false,
      status: 401,
      error: {
        message: 'Token is invalid, You need to log in again'
      }
    });
  });
};

const authorizeUser = (req, res, next) => {
  const { isAdmin } = req.user;
  if (isAdmin === true) {
    return next();
  }
  return res.status(403).send({
    success: false,
    status: 403,
    error: {
      message: 'Error! You don\'t have permission to perform this action'
    },
  });
};

const checkIfUserIsAdmin = (req, res, next) => {
  const { isAdmin } = req.user;
  if (isAdmin === false) {
    return next();
  }
  return res.status(403).send({
    success: false,
    status: 403,
    error: {
      message: 'An Admin account can\'t be used to place an Order'
    }
  });
};

export {
  authorizeUser,
  authenticateUser,
  checkIfUserIsAdmin
};
