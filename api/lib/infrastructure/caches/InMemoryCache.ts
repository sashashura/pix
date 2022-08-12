// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NodeCache'... Remove this comment to see the full error message
const NodeCache = require('node-cache');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('./Cache');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InMemoryCa... Remove this comment to see the full error message
class InMemoryCache extends Cache {
  _cache: $TSFixMe;
  _queue: $TSFixMe;
  constructor() {
    super();
    this._cache = new NodeCache({ useClones: false });
    this._queue = Promise.resolve();
  }

  quit() {
    this._cache.close();
  }

  // @ts-expect-error TS(2416): Property 'get' in type 'InMemoryCache' is not assi... Remove this comment to see the full error message
  async get(key: $TSFixMe, generator: $TSFixMe) {
    return this._syncGet(key, () =>
      this._chainPromise(() => {
        return this._syncGet(key, () => this._generateAndSet(key, generator));
      })
    );
  }

  // @ts-expect-error TS(2416): Property 'set' in type 'InMemoryCache' is not assi... Remove this comment to see the full error message
  async set(key: $TSFixMe, value: $TSFixMe) {
    return this._chainPromise(() => {
      this._cache.set(key, value);
      return value;
    });
  }

  async flushAll() {
    return this._chainPromise(() => {
      this._cache.flushAll();
    });
  }

  async _generateAndSet(key: $TSFixMe, generator: $TSFixMe) {
    const generatedValue = await generator();
    this._cache.set(key, generatedValue);
    return generatedValue;
  }

  async _chainPromise(fn: $TSFixMe) {
    const queuedPromise = this._queue.then(fn);
    this._queue = queuedPromise.catch(() => {
      return;
    });
    return queuedPromise;
  }

  _syncGet(key: $TSFixMe, generator: $TSFixMe) {
    const value = this._cache.get(key);
    if (value) return value;
    return generator();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = InMemoryCache;
