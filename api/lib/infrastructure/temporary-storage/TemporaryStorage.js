const { v4: uuidv4 } = require('uuid');

class TemporaryStorage {
  static generateKey() {
    return uuidv4();
  }

  async save(/* { key, value, expirationDelaySeconds, keepTimeToLive } */) {
    throw new Error('Method #save({ key, value, expirationDelaySeconds, keepTimeToLive }) must be overridden');
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

  withPrefix(prefix) {
    const storage = this;
    return {
      async save({ key, ...args }) {
        key = key ?? TemporaryStorage.generateKey();
        await storage.save({ key: prefix + key, ...args });
        return key;
      },

      get(key) {
        return storage.get(prefix + key);
      },

      delete(key) {
        return storage.delete(prefix + key);
      },

      deleteByPrefix(searchedPrefix) {
        return storage.deleteByPrefix(prefix + searchedPrefix);
      },
    };
  }
}

module.exports = TemporaryStorage;
