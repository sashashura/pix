// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisTempo... Remove this comment to see the full error message
const RedisTemporaryStorage = require('../../../../lib/infrastructure/temporary-storage/RedisTemporaryStorage');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | temporary-storage | RedisTemporaryStorage', function () {
  const REDIS_URL = 'redis_url';

  let clientStub: $TSFixMe;

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    clientStub = {
      get: sinon.stub(),
      set: sinon.stub(),
      del: sinon.stub(),
    };

    sinon.stub(RedisTemporaryStorage, 'createClient').withArgs(REDIS_URL).returns(clientStub);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call static method createClient', function () {
      // when
      const redisTemporaryStorage = new RedisTemporaryStorage(REDIS_URL);

      // then
      expect(RedisTemporaryStorage.createClient).to.have.been.called;
      expect(redisTemporaryStorage._client).to.exist;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#save', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should generated key if key parameter is not valid', async function () {
      // given
      const keyParameter = '  ';
      const value = { name: 'name' };
      const expirationDelaySeconds = 1000;
      sinon.spy(RedisTemporaryStorage, 'generateKey');

      const redisTemporaryStorage = new RedisTemporaryStorage(REDIS_URL);

      // when
      await redisTemporaryStorage.save({
        key: keyParameter,
        value,
        expirationDelaySeconds,
      });

      // then
expect((RedisTemporaryStorage as $TSFixMe).generateKey).to.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should use passed key parameter if valid', async function () {
      // given
      const keyParameter = 'KEY-PARAMETER';
      const value = { name: 'name' };
      const expirationDelaySeconds = 1000;
      sinon.spy(RedisTemporaryStorage, 'generateKey');

      const redisTemporaryStorage = new RedisTemporaryStorage(REDIS_URL);

      // when
      await redisTemporaryStorage.save({
        key: keyParameter,
        value,
        expirationDelaySeconds,
      });

      // then
expect((RedisTemporaryStorage as $TSFixMe).generateKey).not.have.been.called;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call client set with value and EX parameters', async function () {
      // given
      const EXPIRATION_PARAMETER = 'ex';
      const value = { name: 'name' };
      const expirationDelaySeconds = 1000;
      clientStub.set.resolves();
      const redisTemporaryStorage = new RedisTemporaryStorage(REDIS_URL);

      // when
      await redisTemporaryStorage.save({ value, expirationDelaySeconds });

      // then
      expect(clientStub.set).to.have.been.calledWith(
        sinon.match.any,
        JSON.stringify(value),
        EXPIRATION_PARAMETER,
        expirationDelaySeconds
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call client set to retrieve value', async function () {
      // given
      const key = 'valueKey';
      const value = { name: 'name' };
      clientStub.get.withArgs(key).resolves(JSON.stringify(value));
      const redisTemporaryStorage = new RedisTemporaryStorage(REDIS_URL);

      // when
      const result = await redisTemporaryStorage.get(key);

      // then
      expect(clientStub.get).to.have.been.called;
      expect(result).to.deep.equal(value);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#delete', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should call client del to delete value', async function () {
      // given
      const key = 'valueKey';
      clientStub.del.withArgs(key).resolves();
      const redisTemporaryStorage = new RedisTemporaryStorage(REDIS_URL);

      // when
      await redisTemporaryStorage.delete(key);

      // then
      expect(clientStub.del).to.have.been.called;
    });
  });
});
