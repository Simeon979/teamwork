/* eslint-env mocha */
const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../app');
const { query } = require('../db');

const { expect } = chai;
chai.use(chaiHttp);

describe('POST /auth/create-user', () => {
  beforeEach(async () => query('delete from employees'));

  it('should not create an employee with incomplete information', async () => {
    const incomplete = {
      firstName: 'Rockfeller',
      lastName: 'Davies',
      email: 'abc@def.ghi',
    };
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
