// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ChallengeN... Remove this comment to see the full error message
class ChallengeNeutralized {
  certificationCourseId: $TSFixMe;
  juryId: $TSFixMe;
  constructor({
    certificationCourseId,
    juryId
  }: $TSFixMe) {
    this.certificationCourseId = certificationCourseId;
    this.juryId = juryId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ChallengeNeutralized;
