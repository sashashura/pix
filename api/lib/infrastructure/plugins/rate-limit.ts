// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'config'.
const config = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../logger');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const createRedisRateLimit = require('../utils/redis-rate-limit');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TooManyReq... Remove this comment to see the full error message
const { TooManyRequestsError } = require('../../application/http-errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  // @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
  plugin: require('hapi-rate-limiter'),
  options: {
    defaultRate: () => {
      return {
        limit: config.rateLimit.limit,
        window: config.rateLimit.window,
      };
    },
    key: (request: $TSFixMe) => {
      return request.auth.credentials.userId;
    },
    redisClient: config.rateLimit.redisUrl ? createRedisRateLimit(config.rateLimit.redisUrl) : null,
    overLimitError: (rate: $TSFixMe, request: $TSFixMe, h: $TSFixMe) => {
      logger.error({ request_id: request.headers['x-request-id'], overLimit: rate.overLimit }, 'Rate limit exceeded');
      if (config.rateLimit.logOnly) {
        return h.continue;
      } else {
        return new TooManyRequestsError(`Rate Limit Exceeded - try again in ${rate.window} seconds`);
      }
    },
    onRedisError: (err: $TSFixMe) => {
      logger.error(err);
      throw err;
    },
  },
};
