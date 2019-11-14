/* eslint-env mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../app');
const { query } = require('../db');

const { expect } = chai;
chai.use(chaiHttp);

const complete = {
  firstName: 'Rockfeller',
  lastName: 'Davies',
  email: 'abc@def.ghi',
  password: 'abcdefghi',
  gender: 'male',
  jobRole: 'Manager',
  department: 'Quality Assurance',
  address: 'No 0, Nowhere Ave, Unknown.',
};

const incomplete = {
  firstName: 'Rockfeller',
  lastName: 'Davies',
  email: 'abc@def.ghi',
};

describe('POST /auth/create-user', () => {
  beforeEach(async () => query('delete from employees'));

  it('should not create an employee with incomplete information', async () => {
    try {
      const res = await chai.request(app)
        .post('/auth/create-user')
        .send(incomplete);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error');
    } catch (err) {
      expect.fail(err);
    }
  });

  it('should create an employee with complete information', async () => {
    try {
      const res = await chai.request(app)
        .post('/auth/create-user')
        .send(complete);
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('message', 'User account successfully created');
      expect(res.body.data).to.have.property('token').that.is.a('string');
      expect(res.body.data).to.have.property('userId').that.is.a('number');
    } catch (err) {
      expect.fail(err);
    }
  });
});

describe('POST /auth/signin', () => {
  before(async () => {
    try {
      await query('delete from employees');
      await chai.request(app)
        .post('/auth/create-user')
        .send(complete);
    } catch (err) {
      expect.fail(err);
    }
  });

  it('successfully signs user with correct credentials in', async () => {
    try {
      const res = await chai.request(app)
        .post('/auth/signin')
        .send({ email: complete.email, password: complete.password });
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status', 'success');
      expect(res.body).to.have.property('data');
      expect(res.body.data).to.have.property('token').that.is.a('string');
      expect(res.body.data).to.have.property('userId').that.is.a('number');
    } catch (err) {
      expect.fail(err);
    }
  });

  it('fails to sign in user with incorrect credentials', async () => {
    try {
      const res = await chai.request(app)
        .post('/auth/signin')
        .send({ email: complete.email, password: `${complete.password}incorrect` });
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'incorrect email and password combination');
    } catch (err) {
      expect.fail(err);
    }
  });

  it('fails to sign in unregistered user', async () => {
    try {
      const res = await chai.request(app)
        .post('/auth/signin')
        .send({ email: 'haha@not.registered', password: `${complete.password}incorrect` });
      expect(res.body).to.be.a('object');
      expect(res.body).to.have.property('status', 'error');
      expect(res.body).to.have.property('error', 'user not found');
    } catch (err) {
      expect.fail(err);
    }
  });
});
