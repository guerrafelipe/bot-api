const Promise = require('bluebird');
const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const APIError = require('../../helpers/APIError');

/**
 * Message Schema
 */
const MessageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  text: {
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
// MessageSchema.method({
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
MessageSchema.statics = {
  /**
   * Get message
   * @param {ObjectId} id - The objectId of message.
   * @returns {Promise<Message, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((message) => {
        if (message) {
          return message;
        }
        const err = new APIError('No such message exists!', httpStatus.NOT_FOUND, true);
        return Promise.reject(err);
      });
  },

  /**
   * Get message by email
   * @param {ObjectId} email - The email of message.
   * @returns {Promise<Message, APIError>}
   */
  // getByEmail(email) {
  //   return this.findOne({ email })
  //     .exec()
  //     .then((message) => {
  //       if (message) {
  //         return message;
  //       }
  //       const err = new APIError('No such message exists!', httpStatus.NOT_FOUND, true);
  //       return Promise.reject(err);
  //     });
  // },

  /**
   * List messages in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of messages to be skipped.
   * @param {number} limit - Limit number of messages to be returned.
   * @returns {Promise<Message[]>}
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
 * @typedef Message
 */
module.exports = mongoose.model('Message', MessageSchema);
