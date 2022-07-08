const redis = require('redis');
const { promisify } = require('util');
const logger = require('../logger');
const settings = require('../../config');

class RedisRateLimiter {
  constructor() {
    if (settings.rateLimit.redisUrl) {
      this._client = redis.createClient(settings.rateLimit.redisUrl);
      this._client.scriptAsync = promisify(this._client.script).bind(this._client);
      this._client.evalshaAsync = promisify(this._client.evalsha).bind(this._client);
      this._client.on('error', (err) => logger.warn({ redisClient: 'rate-limit', err }, 'Error encountered'));
      return this._client;
    } else {
      this._client = null;
    }
    return this._client;
  }
}

module.exports = new RedisRateLimiter();
