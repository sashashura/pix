// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'redis'.
const redis = require('redis');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'promisify'... Remove this comment to see the full error message
const { promisify } = require('util');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../logger');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function createRedisRateLimit(redisUrl: $TSFixMe) {
  const client = redis.createClient(redisUrl);
  client.scriptAsync = promisify(client.script).bind(client);
  client.evalshaAsync = promisify(client.evalsha).bind(client);
  client.on('error', (err: $TSFixMe) => logger.warn({ redisClient: 'rate-limit', err }, 'Error encountered'));
  return client;
};
