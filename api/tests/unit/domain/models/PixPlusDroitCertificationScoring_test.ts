// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | PixPlusDroitCertificationScoring', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isAcquired', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when Pix+ Droit certification is acquired and reproducibility rate is over 75', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({ value: 76 });
      const pixPlusDroitCertificationScoring = domainBuilder.buildPixPlusDroitCertificationScoring({
        hasAcquiredPixCertification: true,
        reproducibilityRate,
      });

      // when
      const isAcquired = pixPlusDroitCertificationScoring.isAcquired();

      // then
      expect(isAcquired).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when Pix+ Droit certification is acquired and reproducibility rate is equal 75', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({ value: 75 });
      const pixPlusDroitCertificationScoring = domainBuilder.buildPixPlusDroitCertificationScoring({
        hasAcquiredPixCertification: true,
        reproducibilityRate,
      });

      // when
      const isAcquired = pixPlusDroitCertificationScoring.isAcquired();

      // then
      expect(isAcquired).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when Pix+ Droit certification is not acquired even if reproducibility rate is over 75', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({ value: 75 });
      const pixPlusDroitCertificationScoring = domainBuilder.buildPixPlusDroitCertificationScoring({
        hasAcquiredPixCertification: false,
        reproducibilityRate,
      });

      // when
      const isAcquired = pixPlusDroitCertificationScoring.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when reproducibility rate is under 75 even if Pix+ Droit certification is acquired', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({ value: 74 });
      const pixPlusDroitCertificationScoring = domainBuilder.buildPixPlusDroitCertificationScoring({
        hasAcquiredPixCertification: true,
        reproducibilityRate,
      });

      // when
      const isAcquired = pixPlusDroitCertificationScoring.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });
  });
});
