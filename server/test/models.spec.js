import chai, { expect } from 'chai';
import {
  User,
  Order,
  Food,
  Model
} from '../models';

chai.should();

describe('Models Test', () => {
  const order = new Order({
    foodId: '9a16481a-88cc-4145-85c1-52c8344fdf9a',
    customerId: 'a768b2c5-6cbf-4ee2-a3ab-b3a04529b963',
    quantity: 20,
    totalPrice: 4000,
    phoneNumber: '08075647488',
    deliveryAddress: 'No234,Ajalenkoko Str, Ikeja',
    status: 'New'
  });
  const food = new Food({
    title: 'Yam Potato',
    description: 'Satisfying meal for the soul',
    price: 5000,
    imageUrl: 'https:www.foods.com/yam.jpg'
  });
  const user = new User({
    fullname: 'Timileyin E Farayola',
    email: 'rafmme@gmail.com',
    password: 'theMoneyMan',
    isAdmin: false
  });

  describe('Model class Test', () => {
    it('Model should have some function', (done) => {
      expect(typeof Model.create === 'function').to.equal(true);
      expect(typeof Model.find === 'function').to.equal(true);
      expect(typeof Model.findById === 'function').to.equal(true);
      expect(typeof Model.all === 'function').to.equal(true);
      expect(Model.getTableName()).to.equal('models');
      expect(typeof new Model().destroy === 'function').to.equal(true);
      done();
    });
  });

  describe('User Model Test', () => {
    it('an user object should be an instance of User and Model base class', (done) => {
      expect(user instanceof Model).to.equal(true);
      expect(user instanceof User).to.equal(true);
      expect(User.getTableName()).to.equal('users');
      done();
    });
    it('it should have keys id,email,fullname,password,isAdmin', (done) => {
      user.should.have.key('id', 'email', 'fullname', 'password', 'isAdmin');
      done();
    });
  });

  describe('Food Model Test', () => {
    it('a food object should be an instance of Food and Model base class', (done) => {
      expect(food instanceof Model).to.equal(true);
      expect(food instanceof Food).to.equal(true);
      expect(Food.getTableName()).to.equal('foods');
      done();
    });
    it('it should have keys title,description,imageUrl,price', (done) => {
      food.should.have.key('id', 'title', 'description', 'imageUrl', 'price');
      done();
    });
  });

  describe('Order Model Test', () => {
    it('an order object should be an instance of Order and Model base class', (done) => {
      expect(order instanceof Model).to.equal(true);
      expect(order instanceof Order).to.equal(true);
      expect(Order.getTableName()).to.equal('orders');
      done();
    });
    it('it should have keys id,foodId,phoneNumber,customerId,status,quantity,totalPrice,deliveryAddress', (done) => {
      order.should.have.key(
        'id', 'foodId', 'customerId', 'phoneNumber',
        'status', 'quantity', 'totalPrice', 'deliveryAddress'
      );
      done();
    });
  });
});
