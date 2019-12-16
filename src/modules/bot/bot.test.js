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

describe('## Bot APIs', () => {
  let bot = {
    email: faker.internet.email(),
    password: faker.internet.password(),
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  };

  describe('# POST /api/auth/register', () => {
    it('should create a new bot', (done) => {
      request(server)
        .post('/api/auth/register')
        .send(bot)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.token).to.not.equal('');
          expect(res.body.token).to.not.equal(undefined);
          expect(res.body.bot.email).to.equal(bot.email);
          expect(res.body.bot.firstName).to.equal(bot.firstName);
          expect(res.body.bot.lastName).to.equal(bot.lastName);
          expect(res.body.bot.password).to.equal(undefined); // Password should be removed.
          bot = res.body.bot;
          bot.token = res.body.token;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/bots/:botId', () => {
    it('should get bot details', (done) => {
      request(server)
        .get(`/api/bots/${bot._id}`)
        .set({ Authorization: `Bearer ${bot.token}` })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(bot.email);
          expect(res.body.firstName).to.equal(bot.firstName);
          expect(res.body.lastName).to.equal(bot.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when bot does not exists', (done) => {
      request(server)
        .get('/api/bots/56c787ccc67fc16ccc1a5e92')
        .set({ Authorization: `Bearer ${bot.token}` })
        .expect(httpStatus.NOT_FOUND)
        .then((res) => {
          expect(res.body.message).to.equal('No such bot exists!');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/bots/:botId', () => {
    it('should update bot details', (done) => {
      bot.firstName = faker.name.firstName();
      request(server)
        .put(`/api/bots/${bot._id}`)
        .set({ Authorization: `Bearer ${bot.token}` })
        .send(bot)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(bot.email);
          expect(res.body.firstName).to.equal(bot.firstName);
          expect(res.body.lastName).to.equal(bot.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/bots/', () => {
    it('should get all bots', (done) => {
      request(server)
        .get('/api/bots')
        .set({ Authorization: `Bearer ${bot.token}` })
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
        .get('/api/bots/56z787zzz67fc')
        .set({ Authorization: `Bearer ${bot.token}` })
        .expect(httpStatus.INTERNAL_SERVER_ERROR)
        .then((res) => {
          expect(res.body.message).to.equal('Internal Server Error');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/bots/', () => {
    it('should delete bot', (done) => {
      request(server)
        .delete(`/api/bots/${bot._id}`)
        .set({ Authorization: `Bearer ${bot.token}` })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.email).to.equal(bot.email);
          expect(res.body.firstName).to.equal(bot.firstName);
          expect(res.body.lastName).to.equal(bot.lastName);
          expect(res.body.password).to.equal(undefined); // Password should be removed.
          done();
        })
        .catch(done);
    });
  });
});
