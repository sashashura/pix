// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Prescriber... Remove this comment to see the full error message
class Prescriber {
  areNewYearOrganizationLearnersImported: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lang: $TSFixMe;
  lastName: $TSFixMe;
  memberships: $TSFixMe;
  pixOrgaTermsOfServiceAccepted: $TSFixMe;
  userOrgaSettings: $TSFixMe;
  constructor({
    id,
    firstName,
    lastName,
    pixOrgaTermsOfServiceAccepted,
    lang,
    areNewYearOrganizationLearnersImported,
    memberships = [],
    userOrgaSettings
  }: $TSFixMe = {}) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.pixOrgaTermsOfServiceAccepted = pixOrgaTermsOfServiceAccepted;
    this.lang = lang;
    this.areNewYearOrganizationLearnersImported = areNewYearOrganizationLearnersImported;
    this.memberships = memberships;
    this.userOrgaSettings = userOrgaSettings;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Prescriber;
