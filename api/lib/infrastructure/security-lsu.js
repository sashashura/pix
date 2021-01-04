const securityPreHandlers = require('../application/security-lsu-lsl-pre-handlers');

module.exports = {

  scheme() {
    return { authenticate: (request, h) => securityPreHandlers.checkApplicationIsAuthenticated(request, h) };
  },

};
