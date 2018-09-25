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
}
