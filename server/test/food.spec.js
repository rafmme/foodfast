import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import mockFoods from './mockData/food';
import {
  adminToken,
  user1Token,
  invalidToken
} from './mockData/tokens';

chai.use(chaiHttp);
chai.should();

describe('API endpoint POST /menu/', () => {
  it('Admin should successfully add a meal to menu', (done) => {
    chai.request(app)
      .post('/api/v1/menu/')
      .set({ authorization: `Bearer ${adminToken}` })
      .send(mockFoods[0])
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body.message).to.equal('Meal was successfully added to the menu');
        expect(res.body.status).to.equal(201);
        expect(res.body.success).to.equal(true);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('message');
        res.body.should.have.property('meal');
        res.body.meal.should.have.keys(
          'title', 'description', 'id',
          'imageUrl', 'price', 'createdAt',
          'updatedAt'
        );
        done();
      });
  });
  it('Users that are not admin shouldn\'t be able to access the route', (done) => {
    chai.request(app)
      .post('/api/v1/menu')
      .set({ authorization: `Bearer ${user1Token}` })
      .send(mockFoods[0])
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
      .post('/api/v1/menu')
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
      .post('/api/v1/menu')
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
  it('it should return 400 Bad request if empty data is submitted', (done) => {
    chai.request(app)
      .post('/api/v1/menu/')
      .set({ authorization: `Bearer ${adminToken}` })
      .send(mockFoods[1])
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.keys(
          'title', 'description', 'price'
        );
        expect(res.body.error.title).to.equal('Food item title is required, must be within the range of 3 - 150 characters');
        expect(res.body.error.price).to.equal('Price of food item is required, must be an integer');
        expect(res.body.error.description).to.equal('Food item description is required, must be within the range of 3 - 300 characters');
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        done();
      });
  });
  it('it should return 400 Bad request', (done) => {
    chai.request(app)
      .post('/api/v1/menu/')
      .set({ authorization: `Bearer ${adminToken}` })
      .send(mockFoods[2])
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.keys(
          'title', 'price', 'description'
        );
        expect(res.body.error.price).to.equal('Price of food item is required, must be an integer');
        expect(res.body.error.description).to.equal('Food item description is required, must be within the range of 3 - 300 characters');
        expect(res.body.error.title).to.equal('Food item title is required, must be within the range of 3 - 150 characters');
        expect(res.body.status).to.equal(400);
        expect(res.body.success).to.equal(false);
        done();
      });
  });
  it('it should return 409 Conflict if Food exist', (done) => {
    chai.request(app)
      .post('/api/v1/menu/')
      .set({ authorization: `Bearer ${adminToken}` })
      .send(mockFoods[3])
      .end((err, res) => {
        res.should.have.status(409);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        expect(res.body.status).to.equal(409);
        expect(res.body.success).to.equal(false);
        res.body.error.should.have.keys('message');
        expect(res.body.error.message).to.equal(`Food item ${mockFoods[3].title} already exist on the app`);
        done();
      });
  });
});
