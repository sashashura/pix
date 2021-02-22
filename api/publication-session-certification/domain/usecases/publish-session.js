const PublishableSession = require('../models/PublishableSession');
// eslint-disable-next-line no-unused-vars
const lodash = require('lodash');
module.exports = function() {
  return new PublishableSession({ id: 1 });
};
