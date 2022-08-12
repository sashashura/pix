// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'trim'.
const trim = require('lodash/trim');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TemporaryS... Remove this comment to see the full error message
const TemporaryStorage = require('./TemporaryStorage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisClien... Remove this comment to see the full error message
const RedisClient = require('../utils/RedisClient');

const EXPIRATION_PARAMETER = 'ex';

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisTempo... Remove this comment to see the full error message
class RedisTemporaryStorage extends TemporaryStorage {
  _client: $TSFixMe;
  constructor(redisUrl: $TSFixMe) {
    super();
    this._client = RedisTemporaryStorage.createClient(redisUrl);
  }

  static createClient(redisUrl: $TSFixMe) {
    return new RedisClient(redisUrl, { name: 'temporary-storage', prefix: 'temporary-storage:' });
  }

  async save({
    key,
    value,
    expirationDelaySeconds
  }: $TSFixMe) {
    const storageKey = trim(key) || (RedisTemporaryStorage as $TSFixMe).generateKey();

    const objectAsString = JSON.stringify(value);
    await this._client.set(storageKey, objectAsString, EXPIRATION_PARAMETER, expirationDelaySeconds);
    return storageKey;
  }

  async get(key: $TSFixMe) {
    const value = await this._client.get(key);
    return JSON.parse(value);
  }

  async delete(key: $TSFixMe) {
    await this._client.del(key);
  }

  async deleteByPrefix(prefix: $TSFixMe) {
    await this._client.deleteByPrefix(prefix);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = RedisTemporaryStorage;
