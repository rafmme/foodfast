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
    const arr = [
      'A', 'B', 'C', 'D', 'E', 'F',
      'G', 'H', 'I', 'J', 'K', 'L',
      'M', 'N', 'O', 'P', 'Q', 'R',
      'S', 'T', 'U', 'V', 'W', 'X',
      'Y', 'Z'
    ];
    const isUpper = arr.includes(alphab);
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

export {
  convertToCamelCase,
  convertToUnderscore,
  changeObjectKeysToCamelCase,
};
