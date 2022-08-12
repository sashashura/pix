// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class CertificationAnswerStatusChangeAttempt {
  questionNumber: $TSFixMe;
  status: $TSFixMe;
  constructor(questionNumber: $TSFixMe, status: $TSFixMe) {
    this.questionNumber = questionNumber;
    this.status = status;
  }

  static changed(questionNumber: $TSFixMe) {
    return new CertificationAnswerStatusChangeAttempt(questionNumber, CertificationAnswerStatusChangeStatus.CHANGED);
  }

  static failed(questionNumber: $TSFixMe) {
    return new CertificationAnswerStatusChangeAttempt(questionNumber, CertificationAnswerStatusChangeStatus.FAILURE);
  }

  static skipped(questionNumber: $TSFixMe) {
    return new CertificationAnswerStatusChangeAttempt(questionNumber, CertificationAnswerStatusChangeStatus.SKIPPED);
  }

  hasFailed() {
    return this.status === CertificationAnswerStatusChangeStatus.FAILURE;
  }

  hasSucceeded() {
    return this.status === CertificationAnswerStatusChangeStatus.CHANGED;
  }

  wasSkipped() {
    return this.status === CertificationAnswerStatusChangeStatus.SKIPPED;
  }
};

const CertificationAnswerStatusChangeStatus = {
  CHANGED: 'CHANGED',
  FAILURE: 'FAILURE',
  SKIPPED: 'SKIPPED',
};
