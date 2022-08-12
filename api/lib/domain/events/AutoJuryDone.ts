// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class AutoJuryDone {
  certificationCenterName: $TSFixMe;
  finalizedAt: $TSFixMe;
  hasExaminerGlobalComment: $TSFixMe;
  sessionDate: $TSFixMe;
  sessionId: $TSFixMe;
  sessionTime: $TSFixMe;
  constructor({
    sessionId,
    finalizedAt,
    certificationCenterName,
    sessionDate,
    sessionTime,
    hasExaminerGlobalComment
  }: $TSFixMe) {
    this.sessionId = sessionId;
    this.finalizedAt = finalizedAt;
    this.certificationCenterName = certificationCenterName;
    this.sessionDate = sessionDate;
    this.sessionTime = sessionTime;
    this.hasExaminerGlobalComment = hasExaminerGlobalComment;
  }
};
