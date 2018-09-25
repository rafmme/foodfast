import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
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
