// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationOfficer {
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationOfficer;
