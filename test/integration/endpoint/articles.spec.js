/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../../../app');
const { query } = require('../../../db');

const { expect } = chai;
chai.use(chaiHttp);

const uploadedTestArticleTitle = 'Awesome title';
const uploadedTestArticleContent = 'My very AWESOME content';

const testUser = {
  firstName: 'Rockfeller',
  lastName: 'Davies',
  email: 'abc@def.ghi',
  password: 'abcdefghi',
  gender: 'male',
  jobRole: 'Manager',
  department: 'Quality Assurance',
  address: 'No 0, Nowhere Ave, Unknown.',
};

describe('/articles', () => {
  let token;

  before(async () => {
    try {
      await query('TRUNCATE employees CASCADE');
      await query('TRUNCATE articles');
      const res = await chai.request(app)
        .post('/auth/create-user')
        .send(testUser);
      token = res.body.data.token;
    } catch (err) {
      expect.fail(err);
    }
  });

  describe('POST /', () => {
    it('successfully uploads articles', async () => {
      try {
        const res = await chai.request(app)
          .post('/articles')
          .set('token', token)
          .send({
            title: uploadedTestArticleTitle,
            article: uploadedTestArticleContent,
          });

        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('articleId').that.is.a('string');
        expect(res.body.data).to.have.property('message', 'Article successfully posted');
        expect(res.body.data).to.have.property('createdOn').that.is.a('string');
        expect(res.body.data).to.have.property('title', uploadedTestArticleTitle);
      } catch (err) {
        expect.fail(err);
      }
    });
  });
});
