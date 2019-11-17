/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { app } = require('../../app');
const { query } = require('../../db');

const { expect } = chai;
chai.use(chaiHttp);

const testArticles = [
  {
    title: 'Awesome title 1',
    article: 'My very AWESOME content 1',
  },
  {
    title: 'Awesome title 2',
    article: 'My very AWESOME content 2',
  },
  {
    title: 'Awesome title 3',
    article: 'My very AWESOME content 3',
  },
];

const testGifs = [
  {
    title: 'Awesome gif 1',
    gif: 'test/integration/endpoint/test.gif',
  },
  {
    title: 'Awesome gif 2',
    gif: 'test/integration/endpoint/test.gif',
  },
];

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

describe('/api/v1/feed', () => {
  let token;
  before(async () => {
    try {
      // start on a clean slate
      await query('TRUNCATE employees CASCADE');
      await query('TRUNCATE articles CASCADE');
      await query('TRUNCATE uploaded_gifs CASCADE');

      // create the user for the test
      const res = await chai.request(app)
        .post('/api/v1/auth/create-user')
        .send(testUser);
      token = res.body.data.token;

      // add some test articles and gifs for the test
      const articleReqs = testArticles.map(async (article) => {
        const response = await chai.request(app)
          .post('/api/v1/articles')
          .set('token', token)
          .send(article);
        return response;
      });

      const gifReqs = testGifs.map(async (gif) => {
        const response = await chai.request(app)
          .post('/api/v1/gifs')
          .set('token', token)
          .attach('image', fs.readFileSync(gif.gif), 'test.gif')
          .field('title', gif.title);
        return response;
      });

      await Promise.all([...articleReqs, ...gifReqs]);
    } catch (err) {
      expect.fail(err);
    }
  });

  describe('GET /', () => {
    it('successfully retrieves employees feed', async () => {
      try {
        const res = await chai.request(app)
          .get('/api/v1/feed')
          .set('token', token);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.an('array');
        expect(res.body.data.length).to.be.equal(5);
        res.body.data.forEach((item) => {
          expect(item).to.be.an('object');
          expect(item).to.have.property('id').that.is.a('string');
          expect(item).to.have.property('createdOn').that.is.a('string');
          expect(item).to.have.any.keys(['article', 'url']);
          expect(item).to.have.property('authorId').that.is.a('number');
        });
      } catch (err) {
        expect.fail(err);
      }
    });
  });
});
