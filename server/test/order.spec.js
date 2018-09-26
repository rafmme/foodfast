import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import mockOrders from './mockData/order';
import {
  adminToken,
  user1Token,
  invalidToken
} from './mockData/tokens';

chai.use(chaiHttp);
chai.should();

describe('API endpoint GET /orders/', () => {
  it('Admin should successfully fetch all orders', (done) => {
    chai.request(app)
      .get('/api/v1/orders/')
      .set({ authorization: `Bearer ${adminToken}` })
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.equal('All orders fetched successfully');
        expect(res.body.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('orders');
        expect(res.body.orders).to.be.an('array');
        if (res.body.orders.length >= 1) {
          res.body.orders[0].should.have.keys(
            'orderId', 'food', 'totalPrice',
            'customer', 'quantity', 'createdAt',
            'updatedAt', 'deliveryAddress', 'status'
          );
          expect(res.body.orders[0].customer).to.be.an('object');
          expect(res.body.orders[0].food).to.be.an('object');
          res.body.orders[0].customer.should.have.keys('userId', 'fullname', 'email');
          res.body.orders[0].food.should.have.keys(
            'foodId', 'title', 'description',
            'price', 'imageUrl'
          );
          expect(res.body.orders[0].food.price * res.body.orders[0].quantity)
            .to.equal(res.body.orders[0].totalPrice);
        }
        done();
      });
  });
  it('Users that are not admin shouldn\'t be able to access the route', (done) => {
    chai.request(app)
      .get('/api/v1/orders')
      .set({ authorization: `Bearer ${user1Token}` })
      .send()
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(403);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Error! You don\'t have permission to perform this action');
        done();
      });
  });
  it('it should return 401 Error if token is not provided', (done) => {
    chai.request(app)
      .get('/api/v1/orders')
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('You are not logged in, Token is needed!');
        done();
      });
  });
  it('it should return 401 Error if token provided is not valid', (done) => {
    chai.request(app)
      .get('/api/v1/orders')
      .set({ authorization: `Bearer ${invalidToken}` })
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Token is invalid, You need to log in again');
        done();
      });
  });
});

describe('API endpoint GET /orders/:id', () => {
  it('Admin should be able to fetch a specific order', (done) => {
    chai.request(app)
      .get('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .set({ authorization: `Bearer ${adminToken}` })
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.equal('Order was fetched successfully');
        expect(res.body.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('order');
        expect(res.body.order).to.be.an('object');
        res.body.order.should.have.keys(
          'orderId', 'food', 'totalPrice',
          'customer', 'quantity', 'createdAt',
          'updatedAt', 'deliveryAddress',
          'status', 'phoneNumber'
        );
        expect(res.body.order.customer).to.be.an('object');
        expect(res.body.order.food).to.be.an('object');
        res.body.order.customer.should.have.keys('userId', 'fullname', 'email');
        res.body.order.food.should.have.keys(
          'foodId', 'title', 'description',
          'price', 'imageUrl'
        );
        expect(res.body.order.food.price * res.body.order.quantity)
          .to.equal(res.body.order.totalPrice);
        done();
      });
  });
  it('it should return 400 Bad request if id param is not UUID version 4', (done) => {
    chai.request(app)
      .get('/api/v1/orders/helloworld')
      .set({ authorization: `Bearer ${adminToken}` })
      .send()
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Request ID param is not valid');
        done();
      });
  });
  it('it should return 404 Not Found if order doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/orders/36b90495-2063-482d-a150-595aba109a56')
      .set({ authorization: `Bearer ${adminToken}` })
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('No Order matches the ID of 36b90495-2063-482d-a150-595aba109a56');
        done();
      });
  });

  it('Users that are not admin shouldn\'t be able to access the route', (done) => {
    chai.request(app)
      .get('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .set({ authorization: `Bearer ${user1Token}` })
      .send()
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(403);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Error! You don\'t have permission to perform this action');
        done();
      });
  });
  it('it should return 401 Error if token is not provided', (done) => {
    chai.request(app)
      .get('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('You are not logged in, Token is needed!');
        done();
      });
  });
  it('it should return 401 Error if token provided is not valid', (done) => {
    chai.request(app)
      .get('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .set({ authorization: `Bearer ${invalidToken}` })
      .send()
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Token is invalid, You need to log in again');
        done();
      });
  });
});

describe('API endpoint PUT /orders/:id', () => {
  it('it should not update order with same status', (done) => {
    chai.request(app)
      .put('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({ status: 'New' })
      .end((err, res) => {
        res.should.have.status(422);
        expect(res.body.error.message).to.equal('Order can\'t be updated with the same status');
        expect(res.body.status).to.equal(422);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('it should return 400 bad request if input is empty', (done) => {
    chai.request(app)
      .put('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .set({ authorization: `Bearer ${adminToken}` })
      .send()
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.error.message).to.equal('Status field is required');
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('it should return 400 bad request if input doesn\'t match', (done) => {
    chai.request(app)
      .put('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({ status: 'Sleeping' })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.error.message).to
          .equal('Invalid status input, expects one of [New, Processing, Complete or Cancelled]');
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        done();
      });
  });
  it('Admin should successfully update a specific order', (done) => {
    chai.request(app)
      .put('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({ status: 'Processing' })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body.message).to.equal('Order was updated successfully');
        expect(res.body.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('order');
        expect(res.body.order).to.be.an('object');
        expect(res.body.order.status).to.equal('Processing');
        res.body.order.should.have.keys(
          'orderId', 'food', 'totalPrice',
          'customer', 'quantity', 'createdAt',
          'updatedAt', 'deliveryAddress',
          'status', 'phoneNumber'
        );
        expect(res.body.order.customer).to.be.an('object');
        expect(res.body.order.food).to.be.an('object');
        res.body.order.customer.should.have.keys('userId', 'fullname', 'email');
        res.body.order.food.should.have.keys(
          'foodId', 'title', 'description',
          'price', 'imageUrl'
        );
        expect(res.body.order.food.price * res.body.order.quantity)
          .to.equal(res.body.order.totalPrice);
        done();
      });
  });
  it('it should return 400 Bad request if id param is not UUID version 4', (done) => {
    chai.request(app)
      .put('/api/v1/orders/helloworld')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({ status: 'Processing' })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Request ID param is not valid');
        done();
      });
  });
  it('it should return 404 Not Found if order doesn\'t exist', (done) => {
    chai.request(app)
      .put('/api/v1/orders/36b90495-2063-482d-a150-595aba109a56')
      .set({ authorization: `Bearer ${adminToken}` })
      .send({ status: 'Processing' })
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('No Order matches the ID of 36b90495-2063-482d-a150-595aba109a56');
        done();
      });
  });

  it('Users that are not admin shouldn\'t be able to access the route', (done) => {
    chai.request(app)
      .put('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .set({ authorization: `Bearer ${user1Token}` })
      .send({ status: 'Processing' })
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(403);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Error! You don\'t have permission to perform this action');
        done();
      });
  });
  it('it should return 401 Error if token is not provided', (done) => {
    chai.request(app)
      .put('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .send({ status: 'Processing' })
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('You are not logged in, Token is needed!');
        done();
      });
  });
  it('it should return 401 Error if token provided is not valid', (done) => {
    chai.request(app)
      .put('/api/v1/orders/59b85175-21d0-4af7-bfa8-9dff0f902a98')
      .set({ authorization: `Bearer ${invalidToken}` })
      .send({ status: 'Processing' })
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Token is invalid, You need to log in again');
        done();
      });
  });
});

describe('API endpoint POST /orders/', () => {
  it('it should successfully place an order', (done) => {
    chai.request(app)
      .post('/api/v1/orders/')
      .set({ authorization: `Bearer ${user1Token}` })
      .send(mockOrders[0])
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('order');
        expect(res.body.order).to.be.an('object');
        res.body.order.should.have.keys(
          'id', 'foodId', 'totalPrice',
          'customerId', 'quantity', 'createdAt',
          'updatedAt', 'deliveryAddress',
          'status', 'phoneNumber'
        );
        expect(res.body.order.status).to.equal('New');
        expect(res.body.message).to.equal('Order was made successfully');
        expect(res.body.status).to.equal(201);
        expect(res.body.success).to.equal(true);
        done();
      });
  });
  it('it should return 400 Bad request if empty data is submitted', (done) => {
    chai.request(app)
      .post('/api/v1/orders/')
      .set({ authorization: `Bearer ${user1Token}` })
      .send(mockOrders[1])
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.keys(
          'foodId', 'phoneNumber',
          'deliveryAddress', 'quantity'
        );
        expect(res.body.error.foodId).to.equal('FoodId is required, must be of type UUID version 4');
        expect(res.body.error.quantity)
          .to.equal('Quantity of food to order is required, must be an integer');
        expect(res.body.error.deliveryAddress)
          .to.equal('Delivery address is required, must not be less than 3 characters');
        expect(res.body.error.phoneNumber)
          .to.equal('phoneNumber is required');
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        done();
      });
  });
  it('it should return 400 Bad request', (done) => {
    chai.request(app)
      .post('/api/v1/orders/')
      .set({ authorization: `Bearer ${user1Token}` })
      .send(mockOrders[2])
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.keys(
          'foodId', 'phoneNumber',
          'deliveryAddress', 'quantity'
        );
        expect(res.body.error.foodId).to.equal('FoodId is required, must be of type UUID version 4');
        expect(res.body.error.quantity)
          .to.equal('Quantity of food to order is required, must be an integer');
        expect(res.body.error.deliveryAddress)
          .to.equal('Delivery address is required, must not be less than 3 characters');
        expect(res.body.error.phoneNumber)
          .to.equal('phoneNumber input isn\'t a valid mobile number');
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        done();
      });
  });
  it('it should return 404 Not Found if Food doesn\'t exist', (done) => {
    chai.request(app)
      .post('/api/v1/orders/')
      .set({ authorization: `Bearer ${user1Token}` })
      .send(mockOrders[3])
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        expect(res.body.status).to.equal(404);
        expect(res.body.success).to.equal(false);
        res.body.error.should.have.keys('foodId');
        expect(res.body.error.foodId).to.equal(`Order can't be placed because Food with ID ${mockOrders[3].foodId} doesn't exist`);
        done();
      });
  });
  it('it should return 401 Error if token is not provided', (done) => {
    chai.request(app)
      .post('/api/v1/orders/')
      .send(mockOrders[0])
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('You are not logged in, Token is needed!');
        done();
      });
  });
  it('it should return 401 Error if token provided is not valid', (done) => {
    chai.request(app)
      .post('/api/v1/orders/')
      .set({ authorization: `Bearer ${invalidToken}` })
      .send(mockOrders[0])
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(401);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Token is invalid, You need to log in again');
        done();
      });
  });
  it('Admin should not be able to place an order', (done) => {
    chai.request(app)
      .post('/api/v1/orders/')
      .set({ authorization: `Bearer ${adminToken}` })
      .send(mockOrders[0])
      .end((err, res) => {
        res.should.have.status(403);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('message');
        expect(res.body.error).to.be.an('object');
        expect(res.body.error.message).to.equal('An Admin account can\'t be used to place an Order');
        expect(res.body.status).to.equal(403);
        expect(res.body.success).to.equal(false);
        done();
      });
  });
});
