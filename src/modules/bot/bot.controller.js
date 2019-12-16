const Bot = require('./bot.model');

/**
 * Load bot and append to req.
 */
function load(req, res, next, id) {
  Bot.get(id)
    .then((bot) => {
      req.bot = bot; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get bot
 * @returns {Bot}
 */
function get(req, res) {
  return res.json(req.bot);
}

/**
 * Create new bot
 * @property {string} req.body.name - Name of bot.
 * @returns {Bot}
 */
function create(req, res, next) {
  const bot = new Bot(req.body);

  Bot.findOne({ name: bot.name })
    .exec()
    .then((foundBot) => {
      if (foundBot) {
        return Promise.reject(new APIError('Bot name must be unique', httpStatus.CONFLICT, true));
      }
      return bot.save();
    })
    .then(savedBot => res.json(savedBot))
    .catch(e => next(e));
}

// /**
//  * Get bot profile of logged in bot
//  * @returns {Bot}
//  */
// function getProfile(req, res, next) {
//   Bot.get(res.locals.session._id)
//     .then(bot => res.json(bot.safeModel()))
//     .catch(e => next(e));
// }


/**
 * Update existing bot
 * @property {string} req.body.email - The email of bot.
 * @property {string} req.body.firstName - The firstName of bot.
 * @property {string} req.body.lastName - The lastName of bot.
 * @returns {Bot}
 */
function update(req, res, next) {
  const { bot } = req;
  bot.name = req.body.name;

  bot.save()
    .then(savedBot => res.json(savedBot))
    .catch(e => next(e));
}

/**
 * Get bot list.
 * @property {number} req.query.skip - Number of bots to be skipped.
 * @property {number} req.query.limit - Limit number of bots to be returned.
 * @returns {Bot[]}
 */
function list(req, res, next) {
  const { limit = 50, skip = 0 } = req.query;
  Bot.list({ limit, skip })
    .then(bots => res.json(bots))
    .catch(e => next(e));

}

/**
 * Delete bot.
 * @returns {Bot}
 */
function remove(req, res, next) {
  const { bot } = req;
  bot.remove()
    .then(deletedBot => res.json(deletedBot))
    .catch(e => next(e));
}

module.exports = {
  load,
  get,
  create,
  update,
  list,
  remove,
};
