const RedisTemporaryStorage = require('../../../../lib/infrastructure/temporary-storage/RedisTemporaryStorage');
const { expect } = require('../../../test-helper');

describe('Integration | Infrastructure | TemporaryStorage | RedisTemporaryStorage', function () {
  // this check is used to prevent failure when redis is not setup
  // eslint-disable-next-line mocha/no-setup-in-describe
  if (process.env.REDIS_TEST_URL !== undefined) {
    describe('#deleteByPrefix', function () {
      it('should delete all found keys with the given matching prefix', async function () {
        // given
        const expirationDelaySeconds = 1000;
        const storage = new RedisTemporaryStorage(process.env.REDIS_TEST_URL);
        await storage.save({ key: '456:c', value: 'c', expirationDelaySeconds });
        await storage.save({ key: '123:a', value: 'a', expirationDelaySeconds });
        await storage.save({ key: '123:b', value: 'b', expirationDelaySeconds });

        // when
        await storage.deleteByPrefix('123:');

        // then
        expect(await storage.get('123:a')).to.not.exist;
        expect(await storage.get('123:b')).to.not.exist;
        expect(await storage.get('456:c')).to.exist;
      });
    });

    describe('#set', function () {
      it('should set new value', async function () {
        // given
        const TWO_MINUTES_IN_SECONDS = 2 * 60;
        const value = { url: 'url' };
        const storage = new RedisTemporaryStorage(process.env.REDIS_TEST_URL);
        const key = await storage.save({ value: 'c', expirationDelaySeconds: TWO_MINUTES_IN_SECONDS });

        // when
        await storage.update(key, value);

        // then
        const result = await storage.get(key);
        const expirationDelaySeconds = await storage._client.ttl(key);
        expect(result).to.deep.equal({ url: 'url' });
        expect(expirationDelaySeconds).to.equal(TWO_MINUTES_IN_SECONDS);
      });
    });
  }
});
