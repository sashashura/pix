// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCenterMembership {
  certificationCenter: $TSFixMe;
  createdAt: $TSFixMe;
  disabledAt: $TSFixMe;
  id: $TSFixMe;
  user: $TSFixMe;
  constructor({
    id,
    certificationCenter,
    user,
    createdAt,
    disabledAt
  }: $TSFixMe = {}) {
    this.id = id;
    this.certificationCenter = certificationCenter;
    this.user = user;
    this.createdAt = createdAt;
    this.disabledAt = disabledAt;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCenterMembership;
