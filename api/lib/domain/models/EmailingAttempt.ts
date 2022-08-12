// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = class EmailingAttempt {
  recipientEmail: $TSFixMe;
  status: $TSFixMe;
  constructor(recipientEmail: $TSFixMe, status: $TSFixMe) {
    this.recipientEmail = recipientEmail;
    this.status = status;
  }

  hasFailed() {
    return this.status === AttemptStatus.FAILURE;
  }

  hasSucceeded() {
    return this.status === AttemptStatus.SUCCESS;
  }

  static success(recipientEmail: $TSFixMe) {
    return new EmailingAttempt(recipientEmail, AttemptStatus.SUCCESS);
  }

  static failure(recipientEmail: $TSFixMe) {
    return new EmailingAttempt(recipientEmail, AttemptStatus.FAILURE);
  }
};

const AttemptStatus = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
};
