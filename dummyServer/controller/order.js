import orders from '../model/orders';
import foods from '../model/foods';
import users from '../model/users';
/**
 * @class OrderController
 */
export default class OrderController {
  /**
      * @description handles fetching of all orders
      * @param {*} req - Incoming Request object
      * @param {*} res - Incoming Message
      * @returns {object} res - Route response
      */
  static getAllOrders(req, res) {
    const allOrders = [];
    orders.forEach((order) => {
      // fetch food item details from data structure
      const foodItem = foods.find(food => (food.id === order.foodId));

      // fetch customer info from data structure
      const customer = users.find(user => (order.customerId === user.id));
      const { fullname, email } = customer;
      const customerInfo = {
        userId: customer.id,
        fullname,
        email
      };
      const {
        title,
        description,
        price
      } = foodItem;
      const food = {
        foodId: foodItem.id,
        title,
        description,
        price
      };
      // Push all fetched order info onto allOrders array
      allOrders.push({
        orderId: order.id,
        customer: customerInfo,
        food,
        quantity: order.quantity,
        totalPrice: order.quantity * food.price,
        deliveryAddress: order.deliveryAddress,
        phoneNumber: order.phoneNumber,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      });
    });
    return res.status(200).send({
      success: true,
      status: 200,
      message: 'All orders fetched successfully',
      orders: allOrders,
    });
  }
}
