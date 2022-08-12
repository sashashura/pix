// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NodeCache'... Remove this comment to see the full error message
const NodeCache = require('node-cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'trim'.
const trim = require('lodash/trim');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TemporaryS... Remove this comment to see the full error message
const TemporaryStorage = require('./TemporaryStorage');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InMemoryTe... Remove this comment to see the full error message
class InMemoryTemporaryStorage extends TemporaryStorage {
  _client: $TSFixMe;
  constructor() {
    super();
    this._client = new NodeCache();
  }

  save({
    key,
    value,
    expirationDelaySeconds
  }: $TSFixMe) {
    const storageKey = trim(key) || (InMemoryTemporaryStorage as $TSFixMe).generateKey();
    this._client.set(storageKey, value, expirationDelaySeconds);
    return storageKey;
  }

  get(key: $TSFixMe) {
    return this._client.get(key);
  }

  delete(key: $TSFixMe) {
    return this._client.del(key);
  }

  deleteByPrefix(prefix: $TSFixMe) {
    const keys = this._client.keys();
    const matchingKeys = keys.filter((key: $TSFixMe) => key.startsWith(prefix));
    return this._client.del(matchingKeys);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = InMemoryTemporaryStorage;
