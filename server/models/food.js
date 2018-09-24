import uuidv4 from 'uuid/v4';
import Model from './model';

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
}

export default Food;
