// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserWithAc... Remove this comment to see the full error message
class UserWithActivity {
  codeForLastProfileToShare: $TSFixMe;
  hasAssessmentParticipations: $TSFixMe;
  constructor({
    user,
    hasAssessmentParticipations,
    codeForLastProfileToShare
  }: $TSFixMe) {
    this.hasAssessmentParticipations = hasAssessmentParticipations;
    this.codeForLastProfileToShare = codeForLastProfileToShare;
    Object.assign(this, user);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserWithActivity;
