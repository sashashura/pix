// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'redis'.
const redis = require('redis');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const redisScan = require('node-redis-scan');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Redlock'.
const Redlock = require('redlock');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'promisify'... Remove this comment to see the full error message
const { promisify } = require('util');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../logger');

const REDIS_CLIENT_OPTIONS = {};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class RedisClient {
  _client: $TSFixMe;
  _clientName: $TSFixMe;
  _clientWithLock: $TSFixMe;
  _prefix: $TSFixMe;
  del: $TSFixMe;
  flushall: $TSFixMe;
  get: $TSFixMe;
  lockDisposer: $TSFixMe;
  ping: $TSFixMe;
  set: $TSFixMe;
  constructor(redisUrl: $TSFixMe, {
    name,
    prefix
  }: $TSFixMe = {}) {
    this._clientName = name;

    this._prefix = prefix ?? '';

    this._client = redis.createClient(redisUrl, REDIS_CLIENT_OPTIONS);

    this._client.on('connect', () => logger.info({ redisClient: this._clientName }, 'Connected to server'));
    this._client.on('end', () => logger.info({ redisClient: this._clientName }, 'Disconnected from server'));
    this._client.on('error', (err: $TSFixMe) => logger.warn({ redisClient: this._clientName, err }, 'Error encountered'));

    this._clientWithLock = new Redlock(
      [this._client],
      // As said in the doc, setting retryCount to 0 and treating a failure as the resource being "locked"
      // is a good practice
      { retryCount: 0 }
    );

    this.get = promisify(this._wrapWithPrefix(this._client.get)).bind(this._client);
    this.set = promisify(this._wrapWithPrefix(this._client.set)).bind(this._client);
    this.del = promisify(this._wrapWithPrefix(this._client.del)).bind(this._client);
    this.ping = promisify(this._client.ping).bind(this._client);
    this.flushall = promisify(this._client.flushall).bind(this._client);
    this.lockDisposer = this._clientWithLock.disposer.bind(this._clientWithLock);
  }

  _wrapWithPrefix(fn: $TSFixMe) {
    const prefix = this._prefix;
    return function(this: $TSFixMe, key: $TSFixMe, ...args: $TSFixMe[]) {
      return fn.call(this, prefix + key, ...args);
    };
  }

  subscribe(channel: $TSFixMe) {
    this._client.subscribe(channel, () =>
      logger.info({ redisClient: this._clientName }, `Subscribed to channel '${channel}'`)
    );
  }

  publish(channel: $TSFixMe, message: $TSFixMe) {
    this._client.publish(channel, message, () =>
      logger.info({ redisClient: this._clientName }, `Published on channel '${channel}'`)
    );
  }

  on(event: $TSFixMe, callback: $TSFixMe) {
    this._client.on(event, callback);
  }

  quit() {
    this._client.quit();
  }

  async deleteByPrefix(searchedPrefix: $TSFixMe) {
    const searchedPrefixWithClientPrefix = `${this._prefix}${searchedPrefix}`;
    const escapedPrefix = searchedPrefixWithClientPrefix.replace(/[*?[\\\]]/g, '\\$&');
    const pattern = `${escapedPrefix}*`;
    const redisWithScan = new redisScan(this._client);
    const scan = promisify(redisWithScan.scan).bind(redisWithScan);
    const matchingKeys = await scan(pattern);
    if (matchingKeys.length > 0) {
      const del = promisify(this._client.del).bind(this._client);
      await del(matchingKeys);
    }
  }
};
