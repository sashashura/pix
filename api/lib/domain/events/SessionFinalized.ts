// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class SessionFinalized {
  certificationCenterName: $TSFixMe;
  finalizedAt: $TSFixMe;
  hasExaminerGlobalComment: $TSFixMe;
  sessionDate: $TSFixMe;
  sessionId: $TSFixMe;
  sessionTime: $TSFixMe;
  constructor({
    sessionId,
    finalizedAt,
    hasExaminerGlobalComment,
    sessionDate,
    sessionTime,
    certificationCenterName
  }: $TSFixMe) {
    this.sessionId = sessionId;
    this.finalizedAt = finalizedAt;
    this.hasExaminerGlobalComment = hasExaminerGlobalComment;
    this.sessionDate = sessionDate;
    this.sessionTime = sessionTime;
    this.certificationCenterName = certificationCenterName;
  }
};
