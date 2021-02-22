const PublishableSession = require('../../domain/models/PublishableSession');
module.exports = {
  get(id) {
    return new PublishableSession({ id });
  },
};
