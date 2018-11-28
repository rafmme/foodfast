import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import validator from 'validator';
import sgMail from '@sendgrid/mail';
import { generateEmailSubject } from './mailContentGenerator';
import createHTMLEmail from './mailUtil';

dotenv.config();
const {
  JWT_KEY,
  SENDGRID_API_KEY,
  FOODFAST_EMAIL_ADDRESS,
  ADMIN_EMAIL_ADDRESS
} = process.env;

/**
 * @description a function for generating a JWT token
 * @param {*} data data to encode
 * @returns {string} generated token
 */
const generateToken = (data) => {
  const token = jwt.sign(data, JWT_KEY, { expiresIn: '12h' });
  return token;
};

/**
 * @description a function for encrypting password
 * @param {string} password
 * @returns {string} encrypted password
 */
const encryptPassword = (password) => {
  const encryptedPassword = bcrypt.hashSync(password, 10);
  return encryptedPassword;
};

/**
 * @description a function to check if password matches the encrypted one
 * @param {string} encryptedPassword
 * @param {string} password
 * @returns {boolean} true if the password matches
 */
const checkIfPasswordMatch = (encryptedPassword, password) => {
  const isAMatch = bcrypt.compareSync(password, encryptedPassword);
  return isAMatch;
};

/**
 * @function
 * @description a function to convert a string in underscore to camelCase
 * @param {String} str a string input
 * @returns {String} returns string in camelCase
 */
const convertToCamelCase = (str) => {
  let newStr = '';
  if (str.includes('_')) {
    for (let i = 0; i < str.length; i += 1) {
      if (i !== 0 && str[i - 1] === '_') {
        newStr += str[i].toUpperCase();
      } else if (i === 0) {
        newStr += str[i].toLowerCase();
      } else if (str[i] !== '_') {
        newStr += str[i].toLowerCase();
      }
    }
    return newStr;
  }
  return str;
};

/**
 * @function
 * @description a function to convert a string from camelCase to under_score
 * @param {String} str string input in camelCase
 * @returns {String} a string in underscore
 */
const convertToUnderscore = (str) => {
  let newStr = '';
  const isUpperCase = (alphab) => {
    const isUpper = alphab.match(/[A-Z]/g);
    return isUpper;
  };
  for (let i = 0; i < str.length; i += 1) {
    if (i !== 0 && isUpperCase(str[i])) {
      newStr += `_${str[i].toLowerCase()}`;
    } else {
      newStr += str[i].toLowerCase();
    }
  }
  return newStr;
};

/**
 * @function
 * @description a function to convert all object keys to camelCase
 * @param {Object} obj
 * @returns {Object} an object with keys in camelCase
 */
const changeObjectKeysToCamelCase = (obj) => {
  const newObj = {};
  Object.keys(obj).forEach((o) => {
    if (convertToCamelCase(o) !== o) {
      newObj[convertToCamelCase(o)] = obj[o];
    } else {
      newObj[o] = obj[o];
    }
  });
  return newObj;
};

/**
 * @description a middleware to validate if request id param is UUID version 4
 * @param {*} req Request
 * @param {*} res Response
 * @param {*} next
 * @returns {*} error message if not UUID
 */
const validateIdParam = (req, res, next) => {
  const { id } = req.params;
  if (validator.isUUID(id, 4)) {
    return next();
  }
  return res.status(400).send({
    success: false,
    status: 400,
    error: {
      message: 'Request ID param is not valid'
    }
  });
};

/**
 * @description a function to send email with sendGrid
 * @param {Object} orderData order data
 * @returns {undefined} mails user
 */
const sendEmailHelper = (orderData) => {
  const html = createHTMLEmail(orderData);
  const subject = generateEmailSubject(orderData);
  sgMail.setApiKey(SENDGRID_API_KEY);
  const message = {
    to: orderData.customer.email,
    bcc: ADMIN_EMAIL_ADDRESS,
    from: FOODFAST_EMAIL_ADDRESS,
    subject,
    html
  };
  sgMail.send(message).then(resp => (resp)).catch(err => (err));
};

export {
  convertToCamelCase,
  convertToUnderscore,
  changeObjectKeysToCamelCase,
  generateToken,
  encryptPassword,
  checkIfPasswordMatch,
  validateIdParam,
  sendEmailHelper
};
