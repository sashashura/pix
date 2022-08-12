// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
const ComplementaryCertificationCourseResult = require('./ComplementaryCertificationCourseResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PartnerCer... Remove this comment to see the full error message
const PartnerCertificationScoring = require('./PartnerCertificationScoring');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusEdu... Remove this comment to see the full error message
class PixPlusEduCertificationScoring extends PartnerCertificationScoring {
  hasAcquiredPixCertification: $TSFixMe;
  reproducibilityRate: $TSFixMe;
  constructor({
    complementaryCertificationCourseId,
    certifiableBadgeKey,
    reproducibilityRate,
    hasAcquiredPixCertification
  }: $TSFixMe = {}) {
    super({
      complementaryCertificationCourseId,
      partnerKey: certifiableBadgeKey,
      source: ComplementaryCertificationCourseResult.sources.PIX,
    });

    this.reproducibilityRate = reproducibilityRate;
    this.hasAcquiredPixCertification = hasAcquiredPixCertification;
  }

  isAcquired() {
    return this.hasAcquiredPixCertification && this.reproducibilityRate.isEqualOrAbove(70);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PixPlusEduCertificationScoring;
