import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

chai.use(chaiHttp);
chai.should();

describe('API endpoint GET /orders/', () => {
  it('it should successfully fetch all orders', (done) => {
    chai.request(app)
      .get('/api/v1/orders/')
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
            'updatedAt', 'deliveryAddress',
            'status', 'phoneNumber'
          );
          expect(res.body.orders[0].customer).to.be.an('object');
          expect(res.body.orders[0].food).to.be.an('object');
          res.body.orders[0].customer.should.have.keys('userId', 'fullname', 'email');
          res.body.orders[0].food.should.have.keys(
            'foodId', 'title', 'description',
            'price'
          );
          expect(res.body.orders[0].food.price * res.body.orders[0].quantity)
            .to.equal(res.body.orders[0].totalPrice);
        }
        done();
      });
  });
});

describe('API endpoint GET /orders/:id', () => {
  it('it should successfully fetch a specific order', (done) => {
    chai.request(app)
      .get('/api/v1/orders/1')
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
          'price'
        );
        expect(res.body.order.food.price * res.body.order.quantity)
          .to.equal(res.body.order.totalPrice);
        done();
      });
  });
  it('it should return 400 Bad request if id param is not an integer', (done) => {
    chai.request(app)
      .get('/api/v1/orders/helloworld')
      .send()
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('expects ID param to be an integer');
        done();
      });
  });
  it('it should return 404 Not Found if order doesn\'t exist', (done) => {
    chai.request(app)
      .get('/api/v1/orders/50203')
      .send()
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.success).to.equal(false);
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.should.have.property('error');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('No Order matches the ID of 50203');
        done();
      });
  });
});
