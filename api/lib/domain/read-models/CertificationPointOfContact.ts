// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationPointOfContact {
  allowedCertificationCenterAccesses: $TSFixMe;
  email: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  pixCertifTermsOfServiceAccepted: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    email,
    pixCertifTermsOfServiceAccepted,
    allowedCertificationCenterAccesses
  }: $TSFixMe) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.pixCertifTermsOfServiceAccepted = pixCertifTermsOfServiceAccepted;
    this.allowedCertificationCenterAccesses = allowedCertificationCenterAccesses;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationPointOfContact;
