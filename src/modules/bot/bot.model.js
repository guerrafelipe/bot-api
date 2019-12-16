const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const APIError = require('../../helpers/APIError');

/**
 * Bot Schema
 */
const BotSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
// BotSchema.method({
//   generatePassword(password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//   },
//   validPassword(password) {
//     return bcrypt.compareSync(password, this.password);
//   },
//   safeModel() {
//     return _.omit(this.toObject(), ['password', '__v']);
//   },
// });

/**
 * Statics
 */
BotSchema.statics = {
  /**
   * Get bot
   * @param {ObjectId} id - The objectId of bot.
   * @returns {Promise<Bot, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((bot) => {
        if (bot) {
          return bot;
        }
        const err = new APIError('No such bot exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  /**
   * Get bot by email
   * @param {ObjectId} email - The email of bot.
   * @returns {Promise<Bot, APIError>}
   */
  // getByEmail(email) {
  //   return this.findOne({ email })
  //     .exec()
  //     .then((bot) => {
  //       if (bot) {
  //         return bot;
  //       }
  //       const err = new APIError('No such bot exists!', httpStatus.NOT_FOUND, true);
  //       return Promise.reject(err);
  //     });
  // },

  /**
   * List bots in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of bots to be skipped.
   * @param {number} limit - Limit number of bots to be returned.
   * @returns {Promise<Bot[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },
};

/**
 * @typedef Bot
 */
module.exports = mongoose.model('Bot', BotSchema);
