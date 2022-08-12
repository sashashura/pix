// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationMemberIdentity {
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
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationMemberIdentity;
