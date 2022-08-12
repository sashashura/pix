// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Complement... Remove this comment to see the full error message
class ComplementaryCertificationHabilitation {
  certificationCenterId: $TSFixMe;
  complementaryCertificationId: $TSFixMe;
  id: $TSFixMe;
  constructor({
    id,
    complementaryCertificationId,
    certificationCenterId
  }: $TSFixMe) {
    this.id = id;
    this.complementaryCertificationId = complementaryCertificationId;
    this.certificationCenterId = certificationCenterId;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = ComplementaryCertificationHabilitation;
