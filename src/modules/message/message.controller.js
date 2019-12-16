const Message = require('./message.model');

/**
 * Load message and append to req.
 */
function load(req, res, next, id) {
  Message.get(id)
    .then((message) => {
      req.message = message; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
}

/**
 * Get message
 * @returns {Message}
 */
function get(req, res) {
  return res.json(req.message);
}

/**
 * Create new message
 * @property {string} req.body.name - Name of message.
 * @returns {Message}
 */
function create(req, res, next) {
  const message = new Message(req.body);
  message.save().then(savedMessage => res.json(savedMessage));
}

// /**
//  * Get message profile of logged in message
//  * @returns {Message}
//  */
// function getProfile(req, res, next) {
//   Message.get(res.locals.session._id)
//     .then(message => res.json(message.safeModel()))
//     .catch(e => next(e));
// }


/**
 * Update existing message
 * @property {string} req.body.email - The email of message.
 * @property {string} req.body.firstName - The firstName of message.
 * @property {string} req.body.lastName - The lastName of message.
 * @returns {Message}
 */
function update(req, res, next) {
  const { message } = req;
  message.name = req.body.name;

  message.save()
    .then(savedMessage => res.json(savedMessage))
    .catch(e => next(e));
}

/**
 * Get message list.
 * @property {number} req.query.skip - Number of messages to be skipped.
 * @property {number} req.query.limit - Limit number of messages to be returned.
 * @returns {Message[]}
 */
async function list(req, res, next) {
  console.log("Request message conv body now:", req.query);
  let messages = await Message.find({ conversationId: req.query.conversationId })
  console.log("Found messages:", messages);
  res.json(messages);

  // const { limit = 50, skip = 0 } = req.query;
  // Message.list({ limit, skip })
  //   .then(messages => res.json(messages))
  //   .catch(e => next(e));

}

/**
 * Delete message.
 * @returns {Message}
 */
function remove(req, res, next) {
  const { message } = req;
  message.remove()
    .then(deletedMessage => res.json(deletedMessage))
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
