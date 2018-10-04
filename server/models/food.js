import uuidv4 from 'uuid/v4';
import Model from './model';
import DB from '../helpers/dbUtils/dbConn';
import { changeObjectKeysToCamelCase } from '../helpers/utils';

/**
 * @class Food
 * @description model for an Food object
 */
class Food extends Model {
/**
    * @description Create/Instantiate a food object
    * @constructor
    * @param {Object} object object containing values for the instance variables
    * @param {uuid} id - universal unique id for each instance
    */
  constructor(object, id = uuidv4()) {
    super();
    const {
      title,
      description,
      price,
      imageUrl
    } = object;
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }

  /**
   * @method
   * @description a method to handle the update of a meal item info in the database table
   * @param {Object} object data object
   * @returns {Object} returns a promise
   */
  async update(object) {
    const {
      title,
      description,
      price,
      imageUrl
    } = object;
    let promise;
    const query = {
      text: `UPDATE foods SET title = $1, description = $2,
            price = $3, image_url = $4, updated_at = NOW() WHERE id = $5 RETURNING *`,
      values: [title, description, price, imageUrl, this.id]
    };
    try {
      const res = await DB.query(query);
      promise = new Promise(resolve => resolve(changeObjectKeysToCamelCase(res.rows[0])));
      return promise;
    } catch (err) {
      promise = new Promise((resolve, reject) => reject(err));
      return promise;
    }
  }
}

export default Food;
