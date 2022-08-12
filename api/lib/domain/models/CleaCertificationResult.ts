const cleaStatuses = {
  ACQUIRED: 'acquired',
  REJECTED: 'rejected',
  NOT_TAKEN: 'not_taken',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CleaCertif... Remove this comment to see the full error message
class CleaCertificationResult {
  static cleaStatuses = cleaStatuses;

  status: $TSFixMe;

  constructor({
    status
  }: $TSFixMe = {}) {
    this.status = status;
  }

  static buildFrom({
    acquired
  }: $TSFixMe) {
    return new CleaCertificationResult({
      status: acquired ? cleaStatuses.ACQUIRED : cleaStatuses.REJECTED,
    });
  }

  static buildNotTaken() {
    return new CleaCertificationResult({
      status: cleaStatuses.NOT_TAKEN,
    });
  }

  isTaken() {
    return this.status !== cleaStatuses.NOT_TAKEN;
  }

  isAcquired() {
    return this.status === cleaStatuses.ACQUIRED;
  }
}
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CleaCertificationResult;
