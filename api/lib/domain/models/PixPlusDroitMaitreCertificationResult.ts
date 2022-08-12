// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'statuses'.
const statuses = {
  ACQUIRED: 'acquired',
  REJECTED: 'rejected',
  NOT_TAKEN: 'not_taken',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'PixPlusDro... Remove this comment to see the full error message
class PixPlusDroitMaitreCertificationResult {
  static statuses = statuses;

  status: $TSFixMe;

  constructor({
    status
  }: $TSFixMe = {}) {
    this.status = status;
  }

  static buildFrom({
    acquired
  }: $TSFixMe) {
    return new PixPlusDroitMaitreCertificationResult({
    status: acquired ? (statuses as $TSFixMe).ACQUIRED : (statuses as $TSFixMe).REJECTED,
});
  }

  static buildNotTaken() {
    return new PixPlusDroitMaitreCertificationResult({
    status: (statuses as $TSFixMe).NOT_TAKEN,
});
  }

  isTaken() {
    return this.status !== (statuses as $TSFixMe).NOT_TAKEN;
  }

  isAcquired() {
    return this.status === (statuses as $TSFixMe).ACQUIRED;
  }
}
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = PixPlusDroitMaitreCertificationResult;
