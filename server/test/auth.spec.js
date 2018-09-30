import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import mockUsers from './mockData/user';

chai.use(chaiHttp);
chai.should();

describe('API endpoint POST /auth/signup', () => {
  it('it should successfully sign up a new user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(mockUsers[4])
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('token');
        expect(res.body.user).to.be.an('object');
        expect(res.body.token).to.be.an('string');
        expect(res.body.user.email).to.equal(mockUsers[4].email);
        expect(res.body.user.fullname).to.equal(mockUsers[4].fullname);
        expect(res.body.user.isAdmin).to.equal(false);
        res.body.should.have.property('message');
        expect(res.body.message).to.equal('User account created successfully');
        expect(res.body.status).to.equal(201);
        expect(res.body.success).to.equal(true);
        res.body.user.should.have.keys('userId', 'fullname', 'email', 'isAdmin');
        done();
      });
  });
  it('it should not signup existing user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(mockUsers[1])
      .end((err, res) => {
        res.should.have.status(409);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(409);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal(`User with email ${mockUsers[1].email} already exists on the app, try logging in`);
        done();
      });
  });
  it('it should return 400 bad request for empty sign up data', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(mockUsers[0])
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(400);
        res.body.should.have.property('error');
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('password');
        res.body.error.should.have.property('fullname');
        res.body.error.should.have.property('email');
        expect(res.body.error.password).to.equal('Password is required, must be between 8-20 characters');
        expect(res.body.error.email).to.equal('Email is required, and must be a valid email');
        expect(res.body.error.fullname).to.equal('Full Name is required, must be between 3-300 characters');
        done();
      });
  });
  it('it should return 400 bad request if password is not entered', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(mockUsers[2])
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(400);
        res.body.should.have.property('error');
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('password');
        expect(res.body.error.password).to.equal('Password is required, must be between 8-20 characters');
        done();
      });
  });
  it('it should return 400 bad request', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(mockUsers[3])
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(400);
        res.body.should.have.property('error');
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('password');
        res.body.error.should.have.property('email');
        res.body.error.should.have.property('fullname');
        expect(res.body.error.password).to.equal('Password is required, must be between 8-20 characters');
        expect(res.body.error.email).to.equal('Email is required, and must be a valid email');
        expect(res.body.error.fullname).to.equal('Full Name is required, must be between 3-300 characters');
        done();
      });
  });
  it('it should return 400 bad request', (done) => {
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(mockUsers[5])
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(400);
        res.body.should.have.property('error');
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('password');
        res.body.error.should.have.property('email');
        res.body.error.should.have.property('fullname');
        expect(res.body.error.password).to.equal('Password is required, must be between 8-20 characters');
        expect(res.body.error.email).to.equal('Email is required, and must be a valid email');
        expect(res.body.error.fullname).to.equal('Full Name is required, must be between 3-300 characters');
        done();
      });
  });
});


describe('API endpoint POST /auth/login', () => {
  it('it should successfully sign in a user', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'admin@foodfast.com',
        password: 'farayola'
      })
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('token');
        expect(res.body.user).to.be.an('object');
        expect(res.body.token).to.be.an('string');
        expect(res.body.user.email).to.equal('admin@foodfast.com');
        expect(res.body.user.fullname).to.equal('Food Fast');
        expect(res.body.user.userId).to.equal('2a606085-5a9d-4481-a7e1-e7e98bea2160');
        expect(res.body.user.isAdmin).to.equal(true);
        res.body.should.have.property('message');
        expect(res.body.message).to.equal('User sign-in was successful');
        expect(res.body.status).to.equal(200);
        expect(res.body.success).to.equal(true);
        res.body.user.should.have.keys(
          'userId', 'fullname', 'isAdmin', 'email'
        );
        done();
      });
  });
  it('it should show 400 Bad Request if SignIn data is empty', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(400);
        expect(res.body).to.be.an('object');
        res.body.should.have.property('error');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('password');
        res.body.error.should.have.property('email');
        expect(res.body.error.password).to.equal('Password is required, must be between 8-20 characters');
        expect(res.body.error.email).to.equal('Email is required, and must be a valid email');
        done();
      });
  });
  it('it should return 404 Not Found if User does not exist', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'faray@tmail.com',
        password: 'hellotimmy'
      })
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(404);
        res.body.should.have.property('error');
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Login failed! User faray@tmail.com does not exist on the app');
        done();
      });
  });
  it('it should return 400 Bad Request if password is not correct', (done) => {
    chai.request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'rafmme@yah.com',
        password: 'inMyFeelings'
      })
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body.success).to.equal(false);
        expect(res.body.status).to.equal(400);
        res.body.should.have.property('error');
        expect(res.body).to.be.an('object');
        expect(res.body.error).to.be.an('object');
        res.body.error.should.have.property('message');
        expect(res.body.error.message).to.equal('Login failed! credentials not correct');
        done();
      });
  });
});
