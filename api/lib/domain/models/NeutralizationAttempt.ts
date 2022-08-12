// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class NeutralizationAttempt {
  questionNumber: $TSFixMe;
  status: $TSFixMe;
  constructor(questionNumber: $TSFixMe, status: $TSFixMe) {
    this.questionNumber = questionNumber;
    this.status = status;
  }

  static neutralized(questionNumber: $TSFixMe) {
    return new NeutralizationAttempt(questionNumber, NeutralizationStatus.NEUTRALIZED);
  }

  static failure(questionNumber: $TSFixMe) {
    return new NeutralizationAttempt(questionNumber, NeutralizationStatus.FAILURE);
  }

  static skipped(questionNumber: $TSFixMe) {
    return new NeutralizationAttempt(questionNumber, NeutralizationStatus.SKIPPED);
  }

  hasFailed() {
    return this.status === NeutralizationStatus.FAILURE;
  }

  hasSucceeded() {
    return this.status === NeutralizationStatus.NEUTRALIZED;
  }

  wasSkipped() {
    return this.status === NeutralizationStatus.SKIPPED;
  }
};

const NeutralizationStatus = {
  NEUTRALIZED: 'NEUTRALIZED',
  FAILURE: 'FAILURE',
  SKIPPED: 'SKIPPED',
};
