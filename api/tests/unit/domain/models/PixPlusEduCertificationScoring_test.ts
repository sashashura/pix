// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'expect'.
const { expect, domainBuilder } = require('../../../test-helper');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusEdu... Remove this comment to see the full error message
const PixPlusEduCertificationScoring = require('../../../../lib/domain/models/PixPlusEduCertificationScoring');

// @ts-expect-error TS(2582): Cannot find name 'describe'. Do you need to instal... Remove this comment to see the full error message
describe('Unit | Domain | Models | PixPlusEduCertificationScoring', function () {
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#constructor', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('set partnerKey and source', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({ value: 71 });

      // when
      const pixPlusEduCertificationScoring = new PixPlusEduCertificationScoring({
        complementaryCertificationCourseId: 99,
        certifiableBadgeKey: 'BADGE',
        reproducibilityRate,
        hasAcquiredPixCertification: false,
      });

      // then
      expect(pixPlusEduCertificationScoring.source).to.equal('PIX');
      expect(pixPlusEduCertificationScoring.partnerKey).to.equal('BADGE');
    });
  });
  // @ts-expect-error TS(2304): Cannot find name 'context'.
  context('#isAcquired', function () {
    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when Pix+ Edu certification is acquired and reproducibility rate is over 70', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({ value: 71 });
      const pixPlusEduCertificationScoring = domainBuilder.buildPixPlusEduCertificationScoring({
        hasAcquiredPixCertification: true,
        reproducibilityRate,
      });

      // when
      const isAcquired = pixPlusEduCertificationScoring.isAcquired();

      // then
      expect(isAcquired).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns true when Pix+ Edu certification is acquired and reproducibility rate is equal 70', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({ value: 70 });
      const pixPlusEduCertificationScoring = domainBuilder.buildPixPlusEduCertificationScoring({
        hasAcquiredPixCertification: true,
        reproducibilityRate,
      });

      // when
      const isAcquired = pixPlusEduCertificationScoring.isAcquired();

      // then
      expect(isAcquired).to.be.true;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when Pix+ Edu certification is not acquired even if reproducibility rate is over 70', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({ value: 70 });
      const pixPlusEduCertificationScoring = domainBuilder.buildPixPlusEduCertificationScoring({
        hasAcquiredPixCertification: false,
        reproducibilityRate,
      });

      // when
      const isAcquired = pixPlusEduCertificationScoring.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });

    // @ts-expect-error TS(2582): Cannot find name 'it'. Do you need to install type... Remove this comment to see the full error message
    it('returns false when reproducibility rate is under 70 even if Pix+ Edu certification is acquired', function () {
      // given
      const reproducibilityRate = domainBuilder.buildReproducibilityRate({ value: 69 });
      const pixPlusEduCertificationScoring = domainBuilder.buildPixPlusEduCertificationScoring({
        hasAcquiredPixCertification: true,
        reproducibilityRate,
      });

      // when
      const isAcquired = pixPlusEduCertificationScoring.isAcquired();

      // then
      expect(isAcquired).to.be.false;
    });
  });
});
