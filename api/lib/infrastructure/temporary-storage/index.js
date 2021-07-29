const settings = require('../../config');
const REDIS_URL = settings.poleEmploi.temporaryStorage.redisUrl;

const InMemoryTemporaryStorage = require('./InMemoryTemporaryStorage');
const RedisTemporaryStorage = require('./RedisTemporaryStorage');

function _createTemporaryStorage() {
  console.log(`redis url is ${REDIS_URL}`);
  if (REDIS_URL) {
    return new RedisTemporaryStorage(REDIS_URL);
  } else {
    return new InMemoryTemporaryStorage();
  }
}

module.exports = _createTemporaryStorage();
