// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateForSupervising {
  assessmentStatus: $TSFixMe;
  authorizedToStart: $TSFixMe;
  birthdate: $TSFixMe;
  extraTimePercentage: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lastName: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    birthdate,
    extraTimePercentage,
    authorizedToStart,
    assessmentStatus
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthdate = birthdate;
    this.extraTimePercentage = !isNil(extraTimePercentage) ? parseFloat(extraTimePercentage) : extraTimePercentage;
    this.authorizedToStart = authorizedToStart;
    this.assessmentStatus = assessmentStatus;
  }

  authorizeToStart() {
    this.authorizedToStart = true;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCandidateForSupervising;
