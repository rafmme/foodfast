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

  /**
      * @description handles fetching a specific order
      * @param {*} req - Incoming Request object
      * @param {*} res - Incoming Message
      * @returns {object} res - Route response
      */
  static getOrder(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    const order = orders.find(el => el.id === id);
    if (order) {
      const foodItem = foods.find(food => (food.id === order.foodId));
      const customer = users.find(user => (order.customerId === user.id));
      const customerInfo = {
        userId: customer.id,
        fullname: customer.fullname,
        email: customer.email
      };
      const food = {
        foodId: foodItem.id,
        title: foodItem.title,
        description: foodItem.description,
        price: foodItem.price
      };
      const newOrder = {
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
  }

  /**
      * @description handles placing an order
      * @param {*} req - Incoming Request object
      * @param {*} res - Incoming Message
      * @returns {object} res - Route response
      */
  static placeOrder(req, res) {
    const {
      foodId,
      customerId,
      quantity,
      phoneNumber,
      deliveryAddress
    } = req.body;
    const order = {
      id: orders[orders.length - 1].id + 1,
      foodId: Number.parseInt(foodId, 10),
      customerId: Number.parseInt(customerId, 10),
      quantity: Number.parseInt(quantity, 10),
      deliveryAddress: deliveryAddress.trim(),
      phoneNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (orders.push(order)) {
      return res.status(201).send({
        success: true,
        status: 201,
        message: 'Order placed successfully',
        order
      });
    }
  }

  /**
      * @description handles updating the status of an order
      * @param {*} req - Incoming Request object
      * @param {*} res - Incoming Message
      * @returns {object} res - Route response
      */
  static updateOrder(req, res) {
    const id = Number.parseInt(req.params.id, 10);
    const { status } = req.body;
    const order = orders.find((el => (el.id === id)));
    if (order && order.status === status) {
      return res.status(422).send({
        success: false,
        status: 422,
        error: {
          message: 'Order can\'t be updated with the same status'
        }
      });
    } if (order && order.status !== status) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      orders[order.id - 1] = order;
      const foodItem = foods.find(food => (food.id === order.foodId));
      const customer = users.find(user => (order.customerId === user.id));
      const customerInfo = {
        userId: customer.id,
        fullname: customer.fullname,
        email: customer.email
      };
      const food = {
        foodId: foodItem.id,
        title: foodItem.title,
        description: foodItem.description,
        price: foodItem.price
      };
      const newOrder = {
        orderId: order.id,
        customer: customerInfo,
        food,
        quantity: order.quantity,
        totalPrice: order.quantity * food.price,
        deliveryAddress: order.deliveryAddress,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      };

      return res.status(201).send({
        success: true,
        status: 201,
        message: 'Order was updated successfully',
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
  }
}
