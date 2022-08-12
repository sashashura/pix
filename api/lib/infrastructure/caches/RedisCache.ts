// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const { using } = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Redlock'.
const Redlock = require('redlock');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('./Cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisClien... Remove this comment to see the full error message
const RedisClient = require('../utils/RedisClient');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'logger'.
const logger = require('../logger');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');

const REDIS_LOCK_PREFIX = 'locks:';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisCache... Remove this comment to see the full error message
class RedisCache extends Cache {
  _client: $TSFixMe;
  constructor(redis_url: $TSFixMe) {
    super();
    this._client = RedisCache.createClient(redis_url);
  }

  static createClient(redis_url: $TSFixMe) {
    return new RedisClient(redis_url, { name: 'redis-cache-query-client', prefix: 'cache:' });
  }

  // @ts-expect-error TS(2416): Property 'get' in type 'RedisCache' is not assigna... Remove this comment to see the full error message
  async get(key: $TSFixMe, generator: $TSFixMe) {
    const value = await this._client.get(key);

    if (value) return JSON.parse(value);

    return this._manageValueNotFoundInCache(key, generator);
  }

  // @ts-expect-error TS(7023): '_manageValueNotFoundInCache' implicitly has retur... Remove this comment to see the full error message
  async _manageValueNotFoundInCache(key: $TSFixMe, generator: $TSFixMe) {
    const keyToLock = REDIS_LOCK_PREFIX + key;
    const retrieveAndSetValue = async () => {
      logger.info({ key }, 'Executing generator for Redis key');
      const value = await generator();
      return this.set(key, value);
    };
    const unlockErrorHandler = (err: $TSFixMe) => logger.error({ key }, 'Error while trying to unlock Redis key', err);

    try {
      const locker = this._client.lockDisposer(keyToLock, settings.caching.redisCacheKeyLockTTL, unlockErrorHandler);
      const value = await using(locker, retrieveAndSetValue);
      return value;
    } catch (err) {
      if (err instanceof Redlock.LockError) {
        logger.trace({ keyToLock }, 'Could not lock Redis key, waiting');
        // @ts-expect-error TS(2552): Cannot find name 'setTimeout'. Did you mean 'TIMED... Remove this comment to see the full error message
        await new Promise((resolve) => setTimeout(resolve, settings.caching.redisCacheLockedWaitBeforeRetry));
        return this.get(key, generator);
      }
      logger.error({ err }, 'Error while trying to update value in Redis cache');
      throw err;
    }
  }

  // @ts-expect-error TS(2416): Property 'set' in type 'RedisCache' is not assigna... Remove this comment to see the full error message
  async set(key: $TSFixMe, object: $TSFixMe) {
    const objectAsString = JSON.stringify(object);

    logger.info({ key, length: objectAsString.length }, 'Setting Redis key');

    await this._client.set(key, objectAsString);

    return object;
  }

  flushAll() {
    logger.info('Flushing Redis database');

    return this._client.flushall();
  }

  quit() {
    this._client.quit();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = RedisCache;
