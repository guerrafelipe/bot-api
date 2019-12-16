const express = require('express');
const validate = require('express-validation');
const Joi = require('@hapi/joi');
const botCtrl = require('./bot.controller');

const router = express.Router(); // eslint-disable-line new-cap

const paramValidation = {
  createBot: {
    body: {
      name: Joi.string().required()
    },
  },
  updateBot: {
    body: {
      name: Joi.string().required()
    }
    // params: {
    //   _id: Joi.string().required(),
    // },
  },
};

router.route('/')
  /** GET /api/bots - Get list of bots */
  .get(botCtrl.list)

  /** POST /api/bots - Create new bot */
  .post(validate(paramValidation.createBot), botCtrl.create);


router.route('/:botId')
  /** GET /api/bots/:botId - Get bot */
  .get(botCtrl.get)

  /** PUT /api/bots/:botId - Update bot */
  .put(validate(paramValidation.updateBot), botCtrl.update)

  /** DELETE /api/bots/:botId - Delete bot */
  .delete(botCtrl.remove);

/** Load bot when API with botId route parameter is hit */
router.param('botId', botCtrl.load);

module.exports = router;
