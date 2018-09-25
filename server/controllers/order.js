import {
  Order,
  Food,
  User
} from '../models';

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
  static async getAllOrders(req, res) {
    try {
      const allOrders = [];
      const orders = await Order.all();
      const foods = await Food.all();
      const users = await User.all();
      orders.forEach((order) => {
        const food = foods.find(elem => elem.id === order.foodId);
        const customer = users.find(elem => elem.id === order.customerId);
        const customerInfo = {
          userId: customer.id,
          fullname: customer.fullname,
          email: customer.email
        };
        const foodItem = {
          foodId: food.id,
          title: food.title,
          description: food.description,
          price: food.price,
          imageUrl: food.imageUrl
        };

        allOrders.push({
          orderId: order.id,
          customer: customerInfo,
          food: foodItem,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          deliveryAddress: order.deliveryAddress,
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
    } catch (error) {
      return res.status(500).send({
        success: false,
        status: 500,
        error: {
          message: 'An error occured on the server'
        }
      });
    }
  }
}
