// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('./Cache');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LayeredCac... Remove this comment to see the full error message
class LayeredCache extends Cache {
  _firstLevelCache: $TSFixMe;
  _secondLevelCache: $TSFixMe;
  constructor(firstLevelCache: $TSFixMe, secondLevelCache: $TSFixMe) {
    super();
    this._firstLevelCache = firstLevelCache;
    this._secondLevelCache = secondLevelCache;
  }

  // @ts-expect-error TS(2416): Property 'get' in type 'LayeredCache' is not assig... Remove this comment to see the full error message
  get(key: $TSFixMe, generator: $TSFixMe) {
    return this._firstLevelCache.get(key, () => {
      return this._secondLevelCache.get(key, generator);
    });
  }

  // @ts-expect-error TS(2416): Property 'set' in type 'LayeredCache' is not assig... Remove this comment to see the full error message
  async set(key: $TSFixMe, object: $TSFixMe) {
    const cachedObject = await this._secondLevelCache.set(key, object);
    await this._firstLevelCache.flushAll();
    return cachedObject;
  }

  async flushAll() {
    await this._firstLevelCache.flushAll();
    return this._secondLevelCache.flushAll();
  }

  quit() {
    this._firstLevelCache.quit();
    this._secondLevelCache.quit();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = LayeredCache;
