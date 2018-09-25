import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import { generateToken } from '../helpers/utils';
import mockUsers from './mockData/user';

chai.use(chaiHttp);
chai.should();

describe('API endpoint GET /menu', () => {
  mockUsers[1].isAdmin = false;
  const token = generateToken(mockUsers[1]);
  it('it should successfully get the menu if token is valid', (done) => {
    chai.request(app)
      .get('/api/v1/menu')
      .set({ authorization: `Bearer ${token}` })
      .send()
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.menu).to.be.an('array');
        if (res.body.menu.length > 0) {
          res.body.menu[0].should.have.keys(
            'id', 'title', 'description', 'price',
            'imageUrl', 'createdAt', 'updatedAt'
          );
        }
        res.body.should.have.property('message');
        expect(res.body.message).to.equal('Menu was fetched successfully');
        expect(res.body.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        done();
      });
  });
  it('it should return 401 Error if token is not provided', (done) => {
    chai.request(app)
      .get('/api/v1/menu')
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
      .get('/api/v1/menu')
      .set({ authorization: 'Bearer HelloWorld' })
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
