import uuidv4 from 'uuid/v4';
import DB from '../helpers/dbUtils/dbConn';
import Model from './model';

/**
 * @class Order
 * @description model for an Order object
 */
class Order extends Model {
/**
    * @description Create/Instantiate an order object
    * @constructor
    * @param {Object} object object containing values for the instance variables
    * @param {uuid} id - universal unique id for each instance
    */
  constructor(object, id = uuidv4()) {
    super();
    const {
      foodId,
      customerId,
      quantity,
      totalPrice,
      deliveryAddress,
      status,
      phoneNumber
    } = object;
    this.id = id;
    this.foodId = foodId;
    this.customerId = customerId;
    this.quantity = quantity;
    this.totalPrice = totalPrice;
    this.deliveryAddress = deliveryAddress;
    this.status = status;
    this.phoneNumber = phoneNumber;
  }

  /**
   * @method
   * @description a method to handle the update of an order in the database table
   * @param {Object} object data object
   * @returns {Object} returns a promise
   */
  async update(object) {
    const { status } = object;
    let promise;
    const query = {
      text: 'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      values: [status, this.id]
    };
    try {
      const res = await DB.query(query);
      promise = new Promise(resolve => resolve(res.rows[0]));
      return promise;
    } catch (err) {
      promise = new Promise((resolve, reject) => reject(err));
      return promise;
    }
  }
}

export default Order;
