// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Cache'.
const Cache = require('../../../../lib/infrastructure/caches/Cache');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Infrastructure | Caches | Cache', function () {
  const cacheInstance = new Cache();

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#get', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an error (because this class actually mocks an interface)', function () {
      // when
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
      const result = cacheInstance.get('some-key', () => {
        return;
      });

      // then
      expect(result).to.be.rejected;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#set', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an error (because this class actually mocks an interface)', function () {
      // when
      // @ts-expect-error TS(2554): Expected 0 arguments, but got 2.
      const result = cacheInstance.set('some-key', {});

      // then
      expect(result).to.be.rejected;
    });
  });

  // @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
  describe('#flushAll', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('should reject an error (because this class actually mocks an interface)', function () {
      // when
      const result = cacheInstance.flushAll();

      // then
      expect(result).to.be.rejected;
    });
  });
});
