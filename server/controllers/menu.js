import { Food, Order } from '../models';
/**
 * @class MenuController
 */
export default class MenuController {
  /**
    * @description handles fetching of the menu
    * @param {*} req - Incoming Request object
    * @param {*} res - Incoming Message
    * @returns {object} res - Route response
    */
  static async getMenu(req, res) {
    try {
      const menu = await Food.all();
      return res.status(200).send({
        success: true,
        status: 200,
        message: 'Menu was fetched successfully',
        menu
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
    * @description handles adding meal to the menu
    * @param {*} req - Incoming Request object
    * @param {*} res - Incoming Message
    * @returns {object} res - Route response
    */
  static async addMeal(req, res) {
    try {
      const {
        title,
        description,
        price,
        imageUrl
      } = req.body;
      const mealData = {
        title: title.trim(),
        description: description.trim(),
        price,
        imageUrl: imageUrl || 'https://github.com/rafmme/foodfast/blob/gh-pages/UI/assets/images/burrito-chicken-close-up-461198.jpg'
      };
      const meal = await Food.create(mealData);
      if (meal) {
        return res.status(201).send({
          success: true,
          status: 201,
          message: 'Meal was successfully added to the menu',
          meal
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
    * @description handles the deletion of a meal on the menu
    * @param {Object} req - Incoming Request object
    * @param {Object} res - Incoming Message
    * @returns {Object} res - Route response
    */
  static async deleteMeal(req, res) {
    try {
      const { id } = req.params;
      const ordersForMeal = await Order.find({ where: { foodId: id } });
      if (ordersForMeal) {
        return res.status(403).send({
          success: false,
          status: 403,
          error: {
            message: 'Meal item has already been ordered and can\'t be deleted '
          }
        });
      }
      const meal = await Food.findById(id);
      if (meal) {
        await meal.destroy();
        return res.status(204).send({
          success: true,
          status: 204,
          message: 'Meal deletion was successful'
        });
      }
      return res.status(404).send({
        success: false,
        status: 404,
        error: {
          message: `No meal with id of ${id}`
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
    * @description handles the editing of a meal item on the menu
    * @param {Object} req - Incoming Request object
    * @param {Object} res - Incoming Message
    * @returns {Object} res - Route response
    */
  static async editMeal(req, res) {
    try {
      const { id } = req.params;
      const meal = await Food.findById(id);
      if (meal) {
        const result = await meal.update(req.body);
        if (result) {
          return res.status(200).send({
            success: true,
            status: 200,
            message: 'Meal was edited successfully',
            meal: result
          });
        }
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
    * @description handles the fetching of a meal item on the menu
    * @param {Object} req - Incoming Request object
    * @param {Object} res - Incoming Message
    * @returns {Object} res - Route response
    */
  static async getAMeal(req, res) {
    try {
      const { id } = req.params;
      const meal = await Food.findById(id);
      if (meal) {
        return res.status(200).send({
          success: true,
          status: 200,
          message: 'Meal was fetched successfully',
          meal
        });
      }
      return res.status(404).send({
        success: false,
        status: 404,
        error: {
          message: `No meal with id of ${id}`
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
