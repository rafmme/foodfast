import { convertToUnderscore } from '../utils';

/**
 * @function
 * @description a function that construct/generates a sql query statement
 * @param {String} cols object fields matching the db table columns name
 * @param {String} queryClause sql query clause
 * @returns {string} a sql query statement
 */
const generateQueryText = (cols, queryClause) => {
  const arrayOfColumnStrings = cols.split(',');
  const clause = queryClause.toLowerCase() === 'where' ? null : queryClause.slice(1, queryClause.length);
  let queryText = '';
  arrayOfColumnStrings.forEach((val, index) => {
    if (index === 0) {
      queryText += `${val} = $${index + 1}`;
    } else {
      queryText += ` ${clause} ${val} = $${index + 1}`;
    }
  });
  return queryText;
};

/**
 * @function
 * @description a function that extracts keys(db table columns) and values from an object
 * @param {Object} object with fields matching the db table columns name
 * @returns {Object} returns an object with columns and values field
 */
const getObjectKeysAndValues = (object) => {
  const queryData = {};
  queryData.columns = [];
  queryData.values = [];

  Object.keys(object).forEach((key) => {
    queryData.columns.push(convertToUnderscore(key));
    queryData.values.push(object[key]);
  });
  queryData.columns = queryData.columns.join();
  return queryData;
};

/**
 * @function
 * @description a function that generates placeholder for the prepared sql statement
 * @param {Array} array an array that contains the column fields
 * @returns {String} string containing placeholders
 */
const generateValuesTemplate = (array) => {
  const valTemplate = [];
  for (let i = 0; i < array.length; i += 1) {
    const num = i + 1;
    valTemplate.push(`$${num}`);
  }
  return valTemplate.join();
};

/**
 * @function
 * @description a function to check if the sql query clause matches the allowed clauses
 * @param {Object} object object that contains the clause field
 * @returns {String} sql query clause or undefined if it doesn't match the clauses
 */
const getSQLClause = (object) => {
  const clause = Object.keys(object)[0];
  if (clause.toLowerCase() === '$or' || clause.toLowerCase() === '$and' || clause.toLowerCase() === 'where') {
    return clause;
  }
  return undefined;
};

export {
  generateQueryText,
  generateValuesTemplate,
  getObjectKeysAndValues,
  getSQLClause
};
