// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
const CleaCertificationResult = require('../../../../lib/domain/models/CleaCertificationResult');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | CleaCertificationResult', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#static buildFrom', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('builds a CleaCertificationResult acquired', async function () {
      // when
      const cleaCertificationResult = CleaCertificationResult.buildFrom({ acquired: true });

      // then
      expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
      expect(cleaCertificationResult.status).to.equal(CleaCertificationResult.cleaStatuses.ACQUIRED);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('builds a CleaCertificationResult rejected', async function () {
      // when
      const cleaCertificationResult = CleaCertificationResult.buildFrom({ acquired: false });

      // then
      expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
      expect(cleaCertificationResult.status).to.equal(CleaCertificationResult.cleaStatuses.REJECTED);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#static buildNotTaken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('builds a CleaCertificationResult not_taken', async function () {
      // when
      const cleaCertificationResult = CleaCertificationResult.buildNotTaken();

      // then
      expect(cleaCertificationResult).to.be.instanceOf(CleaCertificationResult);
      expect(cleaCertificationResult.status).to.equal(CleaCertificationResult.cleaStatuses.NOT_TAKEN);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isTaken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when CleaCertificationResult has a status acquired', async function () {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();

      // when
      const isTaken = cleaCertificationResult.isTaken();

      // then
      expect(isTaken).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when CleaCertificationResult has a status rejected', async function () {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();

      // when
      const isTaken = cleaCertificationResult.isTaken();

      // then
      expect(isTaken).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when CleaCertificationResult has a status not_taken', async function () {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.notTaken();

      // when
      const isTaken = cleaCertificationResult.isTaken();

      // then
      expect(isTaken).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isAcquired', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when CleaCertificationResult has a status acquired', async function () {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.acquired();

      // when
      const isAcquired = cleaCertificationResult.isAcquired();

      // then
      expect(isAcquired).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when CleaCertificationResult has a status rejected', async function () {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.rejected();

      // when
      const isAcquired = cleaCertificationResult.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when CleaCertificationResult has a status not_taken', async function () {
      // given
      const cleaCertificationResult = domainBuilder.buildCleaCertificationResult.notTaken();

      // when
      const isAcquired = cleaCertificationResult.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });
  });
});
