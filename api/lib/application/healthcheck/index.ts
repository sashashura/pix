// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'healthchec... Remove this comment to see the full error message
const healthcheckController = require('./healthcheck-controller');

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.register = async function (server: $TSFixMe) {
  server.route([
    {
      method: 'GET',
      path: '/api',
      config: {
        auth: false,
        handler: healthcheckController.get,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/healthcheck/db',
      config: {
        auth: false,
        handler: healthcheckController.checkDbStatus,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/healthcheck/redis',
      config: {
        auth: false,
        handler: healthcheckController.checkRedisStatus,
        tags: ['api'],
      },
    },
    {
      method: 'GET',
      path: '/api/healthcheck/crash',
      config: {
        auth: false,
        handler: healthcheckController.crashTest,
        tags: ['api'],
      },
    },
  ]);
};

// @ts-expect-error TS(2304): Cannot find name 'exports'.
exports.name = 'healthcheck-api';
