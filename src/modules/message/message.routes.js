const express = require('express');
const validate = require('express-validation');
const Joi = require('@hapi/joi');
const messageCtrl = require('./message.controller');

const router = express.Router(); // eslint-disable-line new-cap

const paramValidation = {
  createMessage: {
    body: {
      conversationId: Joi.string().required(),
      from: Joi.string().required(),
      to: Joi.string().required(),
      text: Joi.string().required()
    },
  },
  updateMessage: {
    body: {
      conversationId: Joi.string().required(),
      from: Joi.string().required(),
      to: Joi.string().required(),
      text: Joi.string().required()
    }
    // params: {
    //   _id: Joi.string().required(),
    // },
  },

  listMessagesByConversation: {
    param: {
      conversationId: Joi.string().required()
    }
  }
};

router.route('/')
  /** GET /api/messages - Get list of messages */
  .get(validate(paramValidation.listMessagesByConversation), messageCtrl.list)

  /** POST /api/messages - Create new message */
  .post(validate(paramValidation.createMessage), messageCtrl.create);


router.route('/:messageId')
  /** GET /api/messages/:messageId - Get message */
  .get(messageCtrl.get)

  /** PUT /api/messages/:messageId - Update message */
  .put(validate(paramValidation.updateMessage), messageCtrl.update)

  /** DELETE /api/messages/:messageId - Delete message */
  .delete(messageCtrl.remove);

/** Load message when API with messageId route parameter is hit */
router.param('messageId', messageCtrl.load);

module.exports = router;
