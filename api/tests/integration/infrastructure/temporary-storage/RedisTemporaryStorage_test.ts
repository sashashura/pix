// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisTempo... Remove this comment to see the full error message
const RedisTemporaryStorage = require('../../../../lib/infrastructure/temporary-storage/RedisTemporaryStorage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Integration | Infrastructure | TemporaryStorage | RedisTemporaryStorage', function () {
  // this check is used to prevent failure when redis is not setup
  // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
  // eslint-disable-next-line mocha/no-setup-in-describe
  if (process.env.REDIS_TEST_URL !== undefined) {
    // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
    describe('#deleteByPrefix', function () {
      // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
      it('should delete all found keys with the given matching prefix', async function () {
        // given
        const expirationDelaySeconds = 1000;
        // @ts-expect-error TS(2552): Cannot find name 'process'. Did you mean 'PROCESSE... Remove this comment to see the full error message
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
  }
});
