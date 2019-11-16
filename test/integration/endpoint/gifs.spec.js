/* eslint-env mocha */

const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');

const { app } = require('../../../app');
const { query } = require('../../../db');

const { expect } = chai;
chai.use(chaiHttp);

const testComment = 'My very POWERFUL UPLIFTING comment';

const testGif = {
  location: 'test/integration/endpoint/test.gif',
  title: 'Testing gif upload',
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

describe('/gif', function () {
  this.timeout(10000);
  let token;
  let uploadedGif;

  before(async () => {
    try {
      await query('TRUNCATE employees CASCADE');
      await query('TRUNCATE uploaded_gifs CASCADE');
      const res = await chai.request(app)
        .post('/auth/create-user')
        .send(testUser);
      token = res.body.data.token;
    } catch (err) {
      expect.fail(err);
    }
  });

  describe('POST /', () => {
    it('successfully uploads gifs', async () => {
    //    const file = await uploader.upload(uploadedTestGif);
      try {
        const res = await chai.request(app)
          .post('/gifs')
          .set('token', token)
          .field('title', testGif.title)
          .attach('image', fs.readFileSync(testGif.location), 'test.gif');
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('gifId').that.is.a('string');
        expect(res.body.data).to.have.property('message', 'GIF image successfully posted');
        expect(res.body.data).to.have.property('createdOn').that.is.a('string');
        expect(res.body.data).to.have.property('title', testGif.title);
        expect(res.body.data).to.have.property('imageUrl').that.is.a('string');
        uploadedGif = res.body.data;
      } catch (err) {
        expect.fail(err);
      }
    });
  });

  describe('POST /:gifId/comment', () => {
    it('successfully post comment to gifs', async () => {
      try {
        const res = await chai.request(app)
          .post(`/gifs/${uploadedGif.gifId}/comment`)
          .set('token', token)
          .send({ comment: testComment });
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message', 'comment successfully created');
        expect(res.body.data).to.have.property('createdOn').to.be.a('string');
        expect(res.body.data).to.have.property('gifTitle', uploadedGif.title);
        expect(res.body.data).to.have.property('comment', testComment);
      } catch (err) {
        expect.fail(err);
      }
    });
  });

  describe('DELETE /:gifId', () => {
    it('successfully deletes uploaded gifs', async () => {
      try {
        const res = await chai.request(app)
          .delete(`/gifs/${uploadedGif.gifId}`)
          .set('token', token);
        expect(res.body).to.be.a('object');
        expect(res.body).to.have.property('status', 'success');
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.have.property('message', 'gif post successfully deleted');
      } catch (err) {
        expect.fail(err);
      }
    });
  });
});
