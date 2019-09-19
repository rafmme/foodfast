import {
  Order,
  Food,
  User
} from '../models';
import { sendEmailHelper } from '../helpers/utils';

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
          phoneNumber: order.phoneNumber,
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

        sendEmailHelper(orderInfo);
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

  /**
    * @description handles placing an order
    * @param {*} req - Incoming Request object
    * @param {*} res - Incoming Message
    * @returns {object} res - Route response
    */
  static async placeOrder(req, res) {
    try {
      const {
        foodId,
        quantity,
        phoneNumber,
        deliveryAddress
      } = req.body;
      const food = await Food.findById(foodId);
      const totalPrice = food.price * quantity;
      const order = {
        foodId,
        customerId: req.user.userId,
        quantity,
        phoneNumber,
        deliveryAddress,
        totalPrice,
        status: 'New'
      };
      const orderInfo = await Order.create(order);
      if (orderInfo) {
        const customer = await User.findById(order.customerId);
        const customerInfo = {
          fullname: customer.fullname,
          email: customer.email
        };
        const foodItem = {
          title: food.title,
          description: food.description,
          imageUrl: food.imageUrl,
          price: food.price
        };
        const orderData = {
          orderId: orderInfo.id,
          customer: customerInfo,
          food: foodItem,
          quantity: orderInfo.quantity,
          totalPrice: orderInfo.totalPrice,
          deliveryAddress: orderInfo.deliveryAddress,
          phoneNumber: orderInfo.phoneNumber,
          status: orderInfo.status,
          createdAt: orderInfo.createdAt,
          updatedAt: orderInfo.updatedAt,
        };
        sendEmailHelper(orderData);
        return res.status(201).send({
          success: true,
          status: 201,
          message: 'Order was made successfully',
          order: orderData
        });
      }
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
    * @description handles fetching of a user's order history
    * @param {*} req - Incoming Request object
    * @param {*} res - Incoming Message
    * @returns {object} res - Route response
    */
  static async getUserOrders(req, res) {
    try {
      const { id } = req.params;
      const { isAdmin, userId } = req.user;
      const userOrders = [];
      const customer = await User.findById(id);
      if (!customer) {
        return res.status(404).send({
          success: false,
          status: 404,
          error: {
            message: `User with ID of ${id} doesn't exist on the app`
          }
        });
      } if (isAdmin !== true && id !== userId) {
        return res.status(403).send({
          success: false,
          status: 403,
          error: {
            message: 'You don\'t have permission to access this'
          }
        });
      }
      const orders = await Order.find({ where: { customerId: id } });
      const foods = await Food.all();
      if (!orders) {
        return res.status(200).send({
          success: true,
          status: 200,
          message: 'All User Orders fetched successfully',
          orders: [],
        });
      }
      if (orders.length === undefined && orders instanceof Order) {
        const food = foods.find(elem => elem.id === orders.foodId);
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
          price: food.price,
        };

        userOrders.push({
          orderId: orders.id,
          customer: customerInfo,
          food: foodItem,
          quantity: orders.quantity,
          totalPrice: orders.totalPrice,
          phoneNumber: orders.phoneNumber,
          deliveryAddress: orders.deliveryAddress,
          status: orders.status,
          createdAt: orders.createdAt,
          updatedAt: orders.updatedAt,
        });
      } else {
        orders.forEach((order) => {
          const food = foods.find(elem => elem.id === order.foodId);
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
            price: food.price,
          };

          userOrders.push({
            orderId: order.id,
            customer: customerInfo,
            food: foodItem,
            quantity: order.quantity,
            totalPrice: order.totalPrice,
            phoneNumber: order.phoneNumber,
            deliveryAddress: order.deliveryAddress,
            status: order.status,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          });
        });
      }
      return res.status(200).send({
        success: true,
        status: 200,
        message: 'All User Orders fetched successfully',
        orders: userOrders,
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
