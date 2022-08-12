// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('./Cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Distribute... Remove this comment to see the full error message
const DistributedCache = require('./DistributedCache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InMemoryCa... Remove this comment to see the full error message
const InMemoryCache = require('./InMemoryCache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LayeredCac... Remove this comment to see the full error message
const LayeredCache = require('./LayeredCache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisCache... Remove this comment to see the full error message
const RedisCache = require('./RedisCache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

const LEARNING_CONTENT_CHANNEL = 'Learning content';
const LEARNING_CONTENT_CACHE_KEY = 'LearningContent';

class LearningContentCache extends Cache {
  _underlyingCache: $TSFixMe;
  distributedCache: $TSFixMe;
  redisCache: $TSFixMe;
  constructor() {
    super();
    if (settings.caching.redisUrl) {
      this.distributedCache = new DistributedCache(
        new InMemoryCache(),
        settings.caching.redisUrl,
        LEARNING_CONTENT_CHANNEL
      );
      this.redisCache = new RedisCache(settings.caching.redisUrl);

      this._underlyingCache = new LayeredCache(this.distributedCache, this.redisCache);
    } else {
      this._underlyingCache = new InMemoryCache();
    }
  }

  // @ts-expect-error TS(2416): Property 'get' in type 'LearningContentCache' is n... Remove this comment to see the full error message
  get(generator: $TSFixMe) {
    return this._underlyingCache.get(LEARNING_CONTENT_CACHE_KEY, generator);
  }

  // @ts-expect-error TS(2416): Property 'set' in type 'LearningContentCache' is n... Remove this comment to see the full error message
  set(object: $TSFixMe) {
    return this._underlyingCache.set(LEARNING_CONTENT_CACHE_KEY, object);
  }

  flushAll() {
    return this._underlyingCache.flushAll();
  }

  quit() {
    this._underlyingCache.quit();
    this.redisCache.quit();
    this.distributedCache.quit();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = new LearningContentCache();
