// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class FinalizedSession {
  assignedCertificationOfficerName: $TSFixMe;
  certificationCenterName: $TSFixMe;
  finalizedAt: $TSFixMe;
  isPublishable: $TSFixMe;
  publishedAt: $TSFixMe;
  sessionDate: $TSFixMe;
  sessionId: $TSFixMe;
  sessionTime: $TSFixMe;
  constructor({
    sessionId,
    finalizedAt,
    certificationCenterName,
    sessionDate,
    sessionTime,
    isPublishable,
    publishedAt,
    assignedCertificationOfficerName
  }: $TSFixMe = {}) {
    this.sessionId = sessionId;
    this.finalizedAt = finalizedAt;
    this.certificationCenterName = certificationCenterName;
    this.sessionDate = sessionDate;
    this.sessionTime = sessionTime;
    this.isPublishable = isPublishable;
    this.publishedAt = publishedAt;
    this.assignedCertificationOfficerName = assignedCertificationOfficerName;
  }

  static from({
    sessionId,
    finalizedAt,
    certificationCenterName,
    sessionDate,
    sessionTime,
    hasExaminerGlobalComment,
    juryCertificationSummaries,
    hasSupervisorAccess
  }: $TSFixMe) {
    return new FinalizedSession({
      sessionId,
      finalizedAt,
      certificationCenterName,
      sessionDate,
      sessionTime,
      isPublishable:
        !hasExaminerGlobalComment &&
        _hasNoIssueReportsWithRequiredAction(juryCertificationSummaries) &&
        _hasNoScoringError(juryCertificationSummaries) &&
        _hasNoUnfinishedWithoutAbortReason(juryCertificationSummaries) &&
        _hasAllFinishedEndTestScreensSeenByExaminer(hasSupervisorAccess, juryCertificationSummaries),
      publishedAt: null,
    });
  }

  publish(now: $TSFixMe) {
    this.publishedAt = now;
  }

  unpublish() {
    this.publishedAt = null;
  }

  assignCertificationOfficer({
    certificationOfficerName
  }: $TSFixMe) {
    this.isPublishable = false;
    this.assignedCertificationOfficerName = certificationOfficerName;
  }
};

function _hasNoIssueReportsWithRequiredAction(juryCertificationSummaries: $TSFixMe) {
  return !juryCertificationSummaries.some((summary: $TSFixMe) => summary.isActionRequired());
}

function _hasNoScoringError(juryCertificationSummaries: $TSFixMe) {
  return !juryCertificationSummaries.some((summary: $TSFixMe) => {
    return summary.hasScoringError();
  });
}

function _hasNoUnfinishedWithoutAbortReason(juryCertificationSummaries: $TSFixMe) {
  return juryCertificationSummaries
    .filter((certificationSummary: $TSFixMe) => !certificationSummary.completedAt)
    .every((unfinishedCertificationSummary: $TSFixMe) => unfinishedCertificationSummary.isFlaggedAborted);
}

function _hasAllFinishedEndTestScreensSeenByExaminer(hasSupervisorAccess: $TSFixMe, juryCertificationSummaries: $TSFixMe) {
  if (hasSupervisorAccess) return true;
  return juryCertificationSummaries
    .filter((certificationSummary: $TSFixMe) => Boolean(certificationSummary.completedAt))
    .every((finishedCertificationSummary: $TSFixMe) => finishedCertificationSummary.hasSeenEndTestScreen);
}
