import DB from '../helpers/dbUtils/dbConn';
import {
  getObjectKeysAndValues,
  getSQLClause,
  generateQueryText,
  generateValuesTemplate
} from '../helpers/dbUtils/dbQueryUtil';
import { changeObjectKeysToCamelCase } from '../helpers/utils';

/**
 * @class Model
 * @description Base class for all object models
 */
class Model {
  /**
   *
   * @method
   * @description a method to construct the table name according to the className
   * @returns {string} tableName
   */
  static getTableName() {
    const tableName = `${this.name.toLowerCase()}s`;
    return tableName;
  }

  /**
   * @method
   * @description a method that handles the insertion of new data into the database table
   * @param {Object} object
   * @returns {Object} returns a promise
   */
  static async create(object) {
    let promise;
    const tableName = this.getTableName();
    const obj = new this(object);
    const { columns, values } = getObjectKeysAndValues(obj);
    const valTemplate = generateValuesTemplate(values);
    const query = {
      text: `INSERT INTO ${tableName}(${columns}) VALUES (${valTemplate}) RETURNING *`,
      values,
    };
    try {
      const res = await DB.query(query);
      const result = changeObjectKeysToCamelCase(res.rows[0]);
      promise = new Promise(resolve => resolve(result));
      return promise;
    } catch (err) {
      promise = new Promise((resolve, reject) => reject(err));
      return promise;
    }
  }

  /**
   * @method
   * @description a method that handles fetching of all data on the database table
   * @returns {Object} returns a promise
   */
  static async all() {
    let promise;
    const tableName = this.getTableName();
    const query = {
      text: `SELECT * from ${tableName}`,
    };
    try {
      const res = await DB.query(query);
      const newResultArray = res.rows.map(el => changeObjectKeysToCamelCase(el));
      promise = new Promise(resolve => resolve(newResultArray));
      return promise;
    } catch (err) {
      promise = new Promise((resolve, reject) => reject(err));
      return promise;
    }
  }

  /**
   * @method
   * @description a method that handles the deletion of a particular data from the database table
   * @returns {Object} returns promise
   */
  async destroy() {
    let promise;
    const tableName = this.constructor.getTableName();
    const query = {
      text: `DELETE FROM ${tableName} WHERE id = $1`,
      values: [this.id],
    };
    try {
      const res = await DB.query(query);
      promise = new Promise(resolve => resolve(res.rowCount));
      return promise;
    } catch (err) {
      promise = new Promise((resolve, reject) => reject(err));
      return promise;
    }
  }

  /**
   * @method
   * @description a method that fetches a particular data by a given ID from the database table
   * @param {UUID} id
   * @returns {Promise} returns a promise
   */
  static async findById(id) {
    let promise;
    const tableName = this.getTableName();
    const query = {
      text: `SELECT * FROM ${tableName} where id = $1 LIMIT 1`,
      values: [id],
    };
    try {
      const res = await DB.query(query);
      if (res.rows[0]) {
        promise = new Promise((resolve) => {
          const result = changeObjectKeysToCamelCase(res.rows[0]);
          const obj = new this(result, result.id);
          resolve(obj);
        });
        return promise;
      }
      promise = new Promise((resolve) => {
        resolve(undefined);
      });
      return promise;
    } catch (err) {
      promise = new Promise((resolve, reject) => reject(err));
      return promise;
    }
  }

  /**
   * @method
   * @description a method that handles fetching of data from the database
   * table according to some given field
   * @param {Object} object
   * @returns {Object} returns a promise
   */
  static async find(object) {
    const tableName = this.getTableName();
    const clause = getSQLClause(object);
    const { columns, values } = getObjectKeysAndValues(object[clause]);
    if (clause) {
      let promise;
      const query = {
        text: `SELECT * FROM ${tableName} WHERE ${generateQueryText(columns, clause)}`,
        values,
      };
      try {
        const res = await DB.query(query);
        promise = new Promise((resolve) => {
          if (res.rows.length === 0) {
            resolve(undefined);
          } else if (res.rows.length === 1) {
            const result = changeObjectKeysToCamelCase(res.rows[0]);
            const obj = new this(result, result.id);
            resolve(obj);
          } else {
            const newResultArray = res.rows.map(el => changeObjectKeysToCamelCase(el));
            resolve(newResultArray);
          }
        });
        return promise;
      } catch (err) {
        promise = new Promise((resolve, reject) => reject(err));
        return promise;
      }
    }
  }
}

export default Model;
