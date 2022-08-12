// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Assessment... Remove this comment to see the full error message
class AssessmentCompleted {
  assessmentId: $TSFixMe;
  campaignParticipationId: $TSFixMe;
  certificationCourseId: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    assessmentId,
    userId,
    campaignParticipationId,
    certificationCourseId
  }: $TSFixMe = {}) {
    this.assessmentId = assessmentId;
    this.userId = userId;
    this.campaignParticipationId = campaignParticipationId;
    this.certificationCourseId = certificationCourseId;
  }

  get isCertificationType() {
    return Boolean(this.certificationCourseId);
  }

  get isCampaignType() {
    return Boolean(this.campaignParticipationId);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = AssessmentCompleted;
