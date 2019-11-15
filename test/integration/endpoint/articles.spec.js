/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');

const { app } = require('../../../app');
const { query } = require('../../../db');

const { expect } = chai;
chai.use(chaiHttp);

const testArticle = {
  title: 'Awesome title',
  article: 'My very AWESOME content',
};

const updatedTestArticle = {
  title: `updated ${testArticle.title}`,
  article: `updated\n ${testArticle.article}`,
};

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
  let postedArticle;

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
          .send(testArticle);

        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('articleId').that.is.a('string');
        expect(res.body.data).to.have.property('message', 'Article successfully posted');
        expect(res.body.data).to.have.property('createdOn').that.is.a('string');
        expect(res.body.data).to.have.property('title', testArticle.title);
        postedArticle = res.body.data;
      } catch (err) {
        expect.fail(err);
      }
    });
  });

  describe('PATCH /:articleId', () => {
    it('successfully updates posted article', async () => {
      try {
        const res = await chai.request(app)
          .patch(`/articles/${postedArticle.articleId}`)
          .set('token', token)
          .send(updatedTestArticle);

        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message', 'Article successfully updated');
        expect(res.body.data).to.have.property('title', updatedTestArticle.title);
        expect(res.body.data).to.have.property('article', updatedTestArticle.article);
      } catch (err) {
        expect.fail(err);
      }
    });
  });

  describe('DELETE /:articleId', () => {
    it('successfully deletes posted articles', async () => {
      try {
        const res = await chai.request(app)
          .delete(`/articles/${postedArticle.articleId}`)
          .set('token', token);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message', 'Article successfully deleted');
      } catch (err) {
        expect.fail(err);
      }
    });
  });
});
