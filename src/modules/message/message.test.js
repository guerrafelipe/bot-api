const mongoose = require('mongoose');
const request = require('supertest');
const httpStatus = require('http-status');
const faker = require('faker');
const chai = require('chai');
const server = require('../../../index');

/* eslint prefer-destructuring: 0 */
const expect = chai.expect;
chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Message APIs', () => {
  let message = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  describe('# POST /api/auth/register', () => {
    it('should create a new message', (done) => {
      request(server)
        .post('/api/auth/register')
        .send(message)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.not.equal('');
          expect(res.body.token).to.not.equal(undefined);
          expect(res.body.message.email).to.equal(message.email);
          expect(res.body.message.firstName).to.equal(message.firstName);
          expect(res.body.message.lastName).to.equal(message.lastName);
          expect(res.body.message.password).to.equal(undefined); // Password should be removed.
          message = res.body.message;
          message.token = res.body.token;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/messages/:messageId', () => {
    it('should get message details', (done) => {
      request(server)
        .get(`/api/messages/${message._id}`)
        .set({ Authorization: `Bearer ${message.token}` })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(message.email);
          expect(res.body.firstName).to.equal(message.firstName);
          expect(res.body.lastName).to.equal(message.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when message does not exists', (done) => {
      request(server)
        .get('/api/messages/56c787ccc67fc16ccc1a5e92')
        .set({ Authorization: `Bearer ${message.token}` })
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('No such message exists!');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/messages/:messageId', () => {
    it('should update message details', (done) => {
      message.firstName = faker.name.firstName();
      request(server)
        .put(`/api/messages/${message._id}`)
        .set({ Authorization: `Bearer ${message.token}` })
        .send(message)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(message.email);
          expect(res.body.firstName).to.equal(message.firstName);
          expect(res.body.lastName).to.equal(message.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/messages/', () => {
    it('should get all messages', (done) => {
      request(server)
        .get('/api/messages')
        .set({ Authorization: `Bearer ${message.token}` })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# Error Handling', () => {
    it('should handle mongoose CastError - Cast to ObjectId failed', (done) => {
      request(server)
        .get('/api/messages/56z787zzz67fc')
        .set({ Authorization: `Bearer ${message.token}` })
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/messages/', () => {
    it('should delete message', (done) => {
      request(server)
        .delete(`/api/messages/${message._id}`)
        .set({ Authorization: `Bearer ${message.token}` })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(message.email);
          expect(res.body.firstName).to.equal(message.firstName);
          expect(res.body.lastName).to.equal(message.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });
  });
});
