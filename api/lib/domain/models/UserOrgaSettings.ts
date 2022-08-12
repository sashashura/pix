// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
class UserOrgaSettings {
  currentOrganization: $TSFixMe;
  id: $TSFixMe;
  user: $TSFixMe;
  constructor({
    id,
    currentOrganization,
    user
  }: $TSFixMe = {}) {
    this.id = id;
    this.currentOrganization = currentOrganization;
    this.user = user;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserOrgaSettings;
