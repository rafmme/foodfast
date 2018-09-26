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

  /**
    * @description handles fetching of one specific order
    * @param {*} req - Incoming Request object
    * @param {*} res - Incoming Message
    * @returns {object} res - Route response
    */
  static async getOrder(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.find({ where: { id } });
      if (order) {
        const food = await Food.findById(order.foodId);
        const customer = await User.findById(order.customerId);
        const customerInfo = {
          userId: customer.id,
          fullname: customer.fullname,
          email: customer.email
        };
        const foodItem = {
          foodId: food.id,
          title: food.title,
          description: food.description,
          imageUrl: food.imageUrl,
          price: food.price
        };
        const newOrder = {
          orderId: order.id,
          customer: customerInfo,
          food: foodItem,
          quantity: order.quantity,
          totalPrice: order.totalPrice,
          deliveryAddress: order.deliveryAddress,
          phoneNumber: order.phoneNumber,
          status: order.status,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };

        return res.status(200).send({
          success: true,
          status: 200,
          message: 'Order was fetched successfully',
          order: newOrder
        });
      }
      return res.status(404).send({
        success: false,
        status: 404,
        error: {
          message: `No Order matches the ID of ${id}`
        }
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

  /**
    * @description handles updating the status of an order
    * @param {*} req - Incoming Request object
    * @param {*} res - Incoming Message
    * @returns {object} res - Route response
    */
  static async updateOrder(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await Order.findById(id);
      if (order && order.status === status) {
        return res.status(422).send({
          success: false,
          status: 422,
          error: {
            message: 'Order can\'t be updated with the same status'
          }
        });
      } if (order && order.status !== status) {
        const updatedOrder = await order.update(req.body);
        const foodItem = await Food.findById(order.foodId);
        const customer = await User.findById(order.customerId);
        const customerInfo = {
          userId: customer.id,
          fullname: customer.fullname,
          email: customer.email
        };
        const food = {
          foodId: foodItem.id,
          title: foodItem.title,
          description: foodItem.description,
          imageUrl: foodItem.imageUrl,
          price: foodItem.price
        };
        const orderInfo = {
          orderId: updatedOrder.id,
          customer: customerInfo,
          food,
          quantity: updatedOrder.quantity,
          totalPrice: updatedOrder.totalPrice,
          phoneNumber: updatedOrder.phoneNumber,
          deliveryAddress: updatedOrder.deliveryAddress,
          status: updatedOrder.status,
          createdAt: updatedOrder.createdAt,
          updatedAt: updatedOrder.updatedAt,
        };

        return res.status(200).send({
          success: true,
          status: 200,
          message: 'Order was updated successfully',
          order: orderInfo
        });
      }
      return res.status(404).send({
        success: false,
        status: 404,
        error: {
          message: `No Order matches the ID of ${id}`
        }
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
