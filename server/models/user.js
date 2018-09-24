import uuidv4 from 'uuid/v4';
import Model from './model';

/**
 * @class User
 * @description model for User object
 */
class User extends Model {
/**
    * @description Create/Instantiate a user object
    * @constructor
    * @param {Object} object object containing values for the instance variables
    * @param {uuid} id - universal unique id for each instance
    */
  constructor(object, id = uuidv4()) {
    super();
    const {
      fullname,
      email,
      password,
      isAdmin
    } = object;
    this.id = id;
    this.fullname = fullname;
    this.email = email;
    this.password = password;
    this.isAdmin = isAdmin;
  }
}

export default User;
