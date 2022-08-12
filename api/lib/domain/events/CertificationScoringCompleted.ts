// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationScoringCompleted {
  certificationCourseId: $TSFixMe;
  reproducibilityRate: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    certificationCourseId,
    userId,
    reproducibilityRate
  }: $TSFixMe) {
    this.certificationCourseId = certificationCourseId;
    this.userId = userId;
    this.reproducibilityRate = reproducibilityRate;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationScoringCompleted;
