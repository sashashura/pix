// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'uuidv4'.
const { v4: uuidv4 } = require('uuid');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'TemporaryS... Remove this comment to see the full error message
class TemporaryStorage {
  static generateKey() {
    return uuidv4();
  }

  async save(/* { key, value, expirationDelaySeconds } */) {
    throw new Error('Method #save({ key, value, expirationDelaySeconds }) must be overridden');
  }

  async get(/* key */) {
    throw new Error('Method #get(key) must be overridden');
  }

  async delete(/* key */) {
    throw new Error('Method #delete(key) must be overridden');
  }

  async deleteByPrefix(/* prefix */) {
    throw new Error('Method #deleteByPrefix(prefix) must be overridden');
  }

  withPrefix(prefix: $TSFixMe) {
    const storage = this;
    return {
      async save({
        key,
        ...args
      }: $TSFixMe) {
        key = key ?? TemporaryStorage.generateKey();
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        await storage.save({ key: prefix + key, ...args });
        return key;
      },

      get(key: $TSFixMe) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        return storage.get(prefix + key);
      },

      delete(key: $TSFixMe) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        return storage.delete(prefix + key);
      },

      deleteByPrefix(searchedPrefix: $TSFixMe) {
        // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
        return storage.deleteByPrefix(prefix + searchedPrefix);
      },
    };
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = TemporaryStorage;
