// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Distribute... Remove this comment to see the full error message
const DistributedCache = require('../../../../lib/infrastructure/caches/DistributedCache');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Caches | DistributedCache', function () {
  let distributedCacheInstance: $TSFixMe;
  let underlyingCache: $TSFixMe;
  const channel = 'channel';

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    underlyingCache = {
      get: sinon.stub(),
      set: sinon.stub(),
      flushAll: sinon.stub(),
    };
    const redisUrl = 'redis://url.example.net';
    distributedCacheInstance = new DistributedCache(underlyingCache, redisUrl, channel);
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resolve the underlying cache result for get() method', async function () {
      // given
      const cacheKey = 'cache-key';
      const cachedObject = { foo: 'bar' };
      const generator = () => cachedObject;
      underlyingCache.get.withArgs(cacheKey, generator).resolves(cachedObject);

      // when
      const result = await distributedCacheInstance.get(cacheKey, generator);

      // then
      expect(result).to.deep.equal(cachedObject);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#set', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should resovle the underlying cache result for set() method', async function () {
      // given
      const cacheKey = 'cache-key';
      const objectToCache = { foo: 'bar' };
      underlyingCache.set.withArgs(cacheKey, objectToCache).resolves(objectToCache);

      // when
      const result = await distributedCacheInstance.set(cacheKey, objectToCache);

      // then
      expect(result).to.deep.equal(objectToCache);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#flushAll', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('shoud use Redis pub/sub notification mechanism to trigger the caches synchronization', async function () {
      // given
      distributedCacheInstance._redisClientPublisher = {
        publish: sinon.stub(),
      };
      distributedCacheInstance._redisClientPublisher.publish.withArgs(channel, 'Flush all').resolves(true);

      // when
      const result = await distributedCacheInstance.flushAll();

      // then
      expect(result).to.be.true;
    });
  });
});
