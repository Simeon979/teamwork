/* eslint-env mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../../../app');
const { query } = require('../../../db');

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

const testAdmin = { email: 'admin@admin.net', password: 'administrator' };

describe('/api/v1/auth', () => {
  let adminToken;
  let userToken;
  before(async () => {
    try {
      await query('DELETE FROM employees WHERE NOT email=$1', [testAdmin.email]);
    } catch (err) {
      expect.fail(err);
    }
  });

  describe('POST /signin (admin)', () => {
    it('successfully signs admin in', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/signin')
          .send(testAdmin);
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('token').that.is.a('string');
        expect(res.body.data).to.have.property('userId').that.is.a('number');
        adminToken = res.body.data.token;
      } catch (err) {
        expect.fail(err);
      }
    });
  });

  describe('POST /create-user', () => {
    it('should not create an employee with incomplete information', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/create-user')
          .set('token', adminToken)
          .send(incomplete);
        expect(res.status).to.equal(400);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('error', 'there was an error submitting your form');
      } catch (err) {
        expect.fail(err);
      }
    });

    it('should create an employee with complete information', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/create-user')
          .set('token', adminToken)
          .send(complete);
        expect(res.status).to.equal(201);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message', 'User account successfully created');
        expect(res.body.data).to.have.property('token').that.is.a('string');
        expect(res.body.data).to.have.property('userId').that.is.a('number');

        userToken = res.body.data.token;
      } catch (err) {
        expect.fail(err);
      }
    });

    it('should not create en employee when user is not an admin', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/create-user')
          .set('token', userToken)
          .send(complete);
        expect(res.status).to.equal(403);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('error', 'You must be an admin to do this');
      } catch (err) {
        expect.fail(err);
      }
    });
  });

  describe('POST /signin (user)', () => {
    it('successfully signs user with correct credentials in', async () => {
      try {
        const res = await chai.request(app)
          .post('/api/v1/auth/signin')
          .send({ email: complete.email, password: complete.password });
        expect(res.status).to.equal(200);
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
          .post('/api/v1/auth/signin')
          .send({ email: complete.email, password: `${complete.password}incorrect` });
        expect(res.status).to.equal(401);
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
          .post('/api/v1/auth/signin')
          .send({ email: 'haha@not.registered', password: `${complete.password}incorrect` });
        expect(res.status).to.equal(401);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'error');
        expect(res.body).to.have.property('error', 'user not found');
      } catch (err) {
        expect.fail(err);
      }
    });
  });
});
