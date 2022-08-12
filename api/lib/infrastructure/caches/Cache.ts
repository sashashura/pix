// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Cache'.
class Cache {
  async get(/* key, generator */) {
    throw new Error('Method #get(key, generator) must be overridden');
  }

  async set(/* key, object */) {
    throw new Error('Method #set(key, object) must be overridden');
  }

  async flushAll() {
    throw new Error('Method #flushAll() must be overridden');
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Cache;
