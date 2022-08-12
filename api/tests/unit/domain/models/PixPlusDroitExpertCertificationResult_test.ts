// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const PixPlusExpertCertificationResult = require('../../../../lib/domain/models/PixPlusDroitExpertCertificationResult');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | PixPlusExpertCertificationResult', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#static buildFrom', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('builds a PixPlusExpertCertificationResult acquired', async function () {
      // when
      const pixPlusResult = PixPlusExpertCertificationResult.buildFrom({ acquired: true });

      // then
      expect(pixPlusResult).to.be.instanceOf(PixPlusExpertCertificationResult);
      expect(pixPlusResult.status).to.equal(PixPlusExpertCertificationResult.statuses.ACQUIRED);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('builds a PixPlusExpertCertificationResult rejected', async function () {
      // when
      const pixPlusResult = PixPlusExpertCertificationResult.buildFrom({ acquired: false });

      // then
      expect(pixPlusResult).to.be.instanceOf(PixPlusExpertCertificationResult);
      expect(pixPlusResult.status).to.equal(PixPlusExpertCertificationResult.statuses.REJECTED);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#static buildNotTaken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('builds a PixPlusExpertCertificationResult not_taken', async function () {
      // when
      const pixPlusResult = PixPlusExpertCertificationResult.buildNotTaken();

      // then
      expect(pixPlusResult).to.be.instanceOf(PixPlusExpertCertificationResult);
      expect(pixPlusResult.status).to.equal(PixPlusExpertCertificationResult.statuses.NOT_TAKEN);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isTaken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when PixPlusExpertCertificationResult has a status acquired', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.expert.acquired();

      // when
      const isTaken = pixPlusResult.isTaken();

      // then
      expect(isTaken).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when PixPlusExpertCertificationResult has a status rejected', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.expert.rejected();

      // when
      const isTaken = pixPlusResult.isTaken();

      // then
      expect(isTaken).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when PixPlusExpertCertificationResult has a status not_taken', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.expert.notTaken();

      // when
      const isTaken = pixPlusResult.isTaken();

      // then
      expect(isTaken).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isAcquired', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when PixPlusExpertCertificationResult has a status acquired', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.expert.acquired();

      // when
      const isAcquired = pixPlusResult.isAcquired();

      // then
      expect(isAcquired).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when PixPlusExpertCertificationResult has a status rejected', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.expert.rejected();

      // when
      const isAcquired = pixPlusResult.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when PixPlusExpertCertificationResult has a status not_taken', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.expert.notTaken();

      // when
      const isAcquired = pixPlusResult.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });
  });
});
