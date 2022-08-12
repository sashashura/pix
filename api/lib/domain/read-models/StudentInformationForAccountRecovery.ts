// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'StudentInf... Remove this comment to see the full error message
class StudentInformationForAccountRecovery {
  email: $TSFixMe;
  firstName: $TSFixMe;
  lastName: $TSFixMe;
  latestOrganizationName: $TSFixMe;
  username: $TSFixMe;
  constructor({
    firstName,
    lastName,
    username,
    email,
    latestOrganizationName
  }: $TSFixMe = {}) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.latestOrganizationName = latestOrganizationName;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = StudentInformationForAccountRecovery;
