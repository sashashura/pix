// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const PixPlusMaitreCertificationResult = require('../../../../lib/domain/models/PixPlusDroitMaitreCertificationResult');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | PixPlusMaitreCertificationResult', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#static buildFrom', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('builds a PixPlusMaitreCertificationResult acquired', async function () {
      // when
      const pixPlusResult = PixPlusMaitreCertificationResult.buildFrom({ acquired: true });

      // then
      expect(pixPlusResult).to.be.instanceOf(PixPlusMaitreCertificationResult);
      expect(pixPlusResult.status).to.equal(PixPlusMaitreCertificationResult.statuses.ACQUIRED);
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('builds a PixPlusMaitreCertificationResult rejected', async function () {
      // when
      const pixPlusResult = PixPlusMaitreCertificationResult.buildFrom({ acquired: false });

      // then
      expect(pixPlusResult).to.be.instanceOf(PixPlusMaitreCertificationResult);
      expect(pixPlusResult.status).to.equal(PixPlusMaitreCertificationResult.statuses.REJECTED);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#static buildNotTaken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('builds a PixPlusMaitreCertificationResult not_taken', async function () {
      // when
      const pixPlusResult = PixPlusMaitreCertificationResult.buildNotTaken();

      // then
      expect(pixPlusResult).to.be.instanceOf(PixPlusMaitreCertificationResult);
      expect(pixPlusResult.status).to.equal(PixPlusMaitreCertificationResult.statuses.NOT_TAKEN);
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isTaken', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when PixPlusMaitreCertificationResult has a status acquired', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.maitre.acquired();

      // when
      const isTaken = pixPlusResult.isTaken();

      // then
      expect(isTaken).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when PixPlusMaitreCertificationResult has a status rejected', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.maitre.rejected();

      // when
      const isTaken = pixPlusResult.isTaken();

      // then
      expect(isTaken).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when PixPlusMaitreCertificationResult has a status not_taken', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.maitre.notTaken();

      // when
      const isTaken = pixPlusResult.isTaken();

      // then
      expect(isTaken).to.be.false;
    });
  });

  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isAcquired', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when PixPlusMaitreCertificationResult has a status acquired', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.maitre.acquired();

      // when
      const isAcquired = pixPlusResult.isAcquired();

      // then
      expect(isAcquired).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when PixPlusMaitreCertificationResult has a status rejected', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.maitre.rejected();

      // when
      const isAcquired = pixPlusResult.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when PixPlusMaitreCertificationResult has a status not_taken', async function () {
      // given
      const pixPlusResult = domainBuilder.buildPixPlusDroitCertificationResult.maitre.notTaken();

      // when
      const isAcquired = pixPlusResult.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });
  });
});
