import { Food } from '../models';
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
}
