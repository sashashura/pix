// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisClien... Remove this comment to see the full error message
const RedisClient = require('./RedisClient');

class RedisMonitor {
  _client: $TSFixMe;
  constructor() {
    if (settings.caching.redisUrl) {
      this._client = new RedisClient(settings.caching.redisUrl, { name: 'redis-monitor' });
    }
  }

  async ping() {
    if (!this._client) {
      return false;
    }
    return this._client.ping();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = new RedisMonitor();
