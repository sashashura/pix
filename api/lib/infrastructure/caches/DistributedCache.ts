// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('./Cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisClien... Remove this comment to see the full error message
const RedisClient = require('../utils/RedisClient');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Distribute... Remove this comment to see the full error message
class DistributedCache extends Cache {
  _channel: $TSFixMe;
  _redisClientPublisher: $TSFixMe;
  _redisClientSubscriber: $TSFixMe;
  _underlyingCache: $TSFixMe;
  constructor(underlyingCache: $TSFixMe, redisUrl: $TSFixMe, channel: $TSFixMe) {
    super();

    this._underlyingCache = underlyingCache;

    this._redisClientPublisher = new RedisClient(redisUrl, { name: 'distributed-cache-publisher' });
    this._redisClientSubscriber = new RedisClient(redisUrl, { name: 'distributed-cache-subscriber' });
    this._channel = channel;

    this._redisClientSubscriber.on('ready', () => {
      this._redisClientSubscriber.subscribe(this._channel);
    });
    this._redisClientSubscriber.on('message', () => {
      return this._underlyingCache.flushAll();
    });
  }

  // @ts-expect-error TS(2416): Property 'get' in type 'DistributedCache' is not a... Remove this comment to see the full error message
  get(key: $TSFixMe, generator: $TSFixMe) {
    return this._underlyingCache.get(key, generator);
  }

  // @ts-expect-error TS(2416): Property 'set' in type 'DistributedCache' is not a... Remove this comment to see the full error message
  set(key: $TSFixMe, object: $TSFixMe) {
    return this._underlyingCache.set(key, object);
  }

  flushAll() {
    return this._redisClientPublisher.publish(this._channel, 'Flush all');
  }

  quit() {
    this._underlyingCache.quit();
    this._redisClientPublisher.quit();
    this._redisClientSubscriber.quit();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = DistributedCache;
