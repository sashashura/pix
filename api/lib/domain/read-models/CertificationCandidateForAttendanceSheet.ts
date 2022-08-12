// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Certificat... Remove this comment to see the full error message
class CertificationCandidateForAttendanceSheet {
  birthdate: $TSFixMe;
  division: $TSFixMe;
  externalId: $TSFixMe;
  extraTimePercentage: $TSFixMe;
  firstName: $TSFixMe;
  lastName: $TSFixMe;
  constructor({
    lastName,
    firstName,
    birthdate,
    externalId,
    division,
    extraTimePercentage
  }: $TSFixMe) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.birthdate = birthdate;
    this.externalId = externalId;
    this.division = division;
    this.extraTimePercentage = !isNil(extraTimePercentage) ? parseFloat(extraTimePercentage) : extraTimePercentage;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CertificationCandidateForAttendanceSheet;
