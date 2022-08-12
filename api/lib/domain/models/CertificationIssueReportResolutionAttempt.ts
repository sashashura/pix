// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class CertificationIssueReportResolutionAttempt {
  status: $TSFixMe;
  constructor(status: $TSFixMe) {
    this.status = status;
  }

  static resolvedWithEffect() {
    return new CertificationIssueReportResolutionAttempt(ResolutionStatus.RESOLVED_WITH_EFFECT);
  }

  static resolvedWithoutEffect() {
    return new CertificationIssueReportResolutionAttempt(ResolutionStatus.RESOLVED_WITHOUT_EFFECT);
  }

  static unresolved() {
    return new CertificationIssueReportResolutionAttempt(ResolutionStatus.UNRESOLVED);
  }

  isResolvedWithEffect() {
    return this.status === ResolutionStatus.RESOLVED_WITH_EFFECT;
  }
};

const ResolutionStatus = {
  RESOLVED_WITH_EFFECT: 'RESOLVED_WITH_EFFECT',
  RESOLVED_WITHOUT_EFFECT: 'RESOLVED_WITHOUT_EFFECT',
  UNRESOLVED: 'UNRESOLVED',
};
