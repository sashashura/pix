// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, sinon } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'LayeredCac... Remove this comment to see the full error message
const LayeredCache = require('../../../../lib/infrastructure/caches/LayeredCache');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Caches | LayeredCache', function () {
  // @ts-expect-error TS(2554): Expected 2 arguments, but got 0.
  const layeredCacheInstance = new LayeredCache();

  // @ts-expect-error TS(2304): Cannot find name 'beforeEach'.
  beforeEach(function () {
    layeredCacheInstance._firstLevelCache = {
      get: sinon.stub(),
      set: sinon.stub(),
      flushAll: sinon.stub(),
    };
    layeredCacheInstance._secondLevelCache = {
      get: sinon.stub(),
      set: sinon.stub(),
      flushAll: sinon.stub(),
    };
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    const cachedObject = { foo: 'bar' };
    const cacheKey = 'cache-key';
    const generator = () => cachedObject;

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delegate to first level cache, by passing it the second level cache as generator', async function () {
      // given
      layeredCacheInstance._firstLevelCache.get.withArgs(cacheKey).callsFake((key: $TSFixMe, generator: $TSFixMe) => generator());
      layeredCacheInstance._secondLevelCache.get
        .withArgs(cacheKey, generator)
        .callsFake((key: $TSFixMe, generator: $TSFixMe) => generator());

      // when
      const result = await layeredCacheInstance.get(cacheKey, generator);

      // then
      expect(result).to.deep.equal(cachedObject);
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#set', function () {
    const cacheKey = 'cache-key';
    const objectToCache = { foo: 'bar' };

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should delegate to first level cache, by passing it the second level cache as generator', async function () {
      // given
      layeredCacheInstance._secondLevelCache.set.withArgs(cacheKey, objectToCache).resolves(objectToCache);

      // when
      const result = await layeredCacheInstance.set(cacheKey, objectToCache);

      // then
      expect(layeredCacheInstance._firstLevelCache.flushAll).to.have.been.calledOnce;
      expect(result).to.deep.equal(objectToCache);
      expect(layeredCacheInstance._secondLevelCache.set).to.have.been.calledBefore(
        layeredCacheInstance._firstLevelCache.flushAll
      );
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#flushAll', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should flush all entries for both first and second level caches', async function () {
      // given

      // when
      await layeredCacheInstance.flushAll();

      // then
      expect(layeredCacheInstance._firstLevelCache.flushAll).to.have.been.calledOnce;
      expect(layeredCacheInstance._secondLevelCache.flushAll).to.have.been.calledOnce;
    });
  });
});
