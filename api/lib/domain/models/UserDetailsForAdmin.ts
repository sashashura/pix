// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserDetail... Remove this comment to see the full error message
class UserDetailsForAdmin {
  authenticationMethods: $TSFixMe;
  cgu: $TSFixMe;
  createdAt: $TSFixMe;
  email: $TSFixMe;
  emailConfirmedAt: $TSFixMe;
  firstName: $TSFixMe;
  id: $TSFixMe;
  lang: $TSFixMe;
  lastLoggedAt: $TSFixMe;
  lastName: $TSFixMe;
  lastPixCertifTermsOfServiceValidatedAt: $TSFixMe;
  lastPixOrgaTermsOfServiceValidatedAt: $TSFixMe;
  lastTermsOfServiceValidatedAt: $TSFixMe;
  organizationLearners: $TSFixMe;
  pixCertifTermsOfServiceAccepted: $TSFixMe;
  pixOrgaTermsOfServiceAccepted: $TSFixMe;
  username: $TSFixMe;
  constructor({
    id,
    cgu,
    username,
    firstName,
    lastName,
    email,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    organizationLearners,
    authenticationMethods,
    createdAt,
    lang,
    lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt,
    lastLoggedAt,
    emailConfirmedAt
  }: $TSFixMe = {}) {
    this.id = id;
    this.cgu = cgu;
    this.firstName = firstName;
    this.lastName = lastName;
    this.username = username;
    this.email = email;
    this.pixOrgaTermsOfServiceAccepted = pixOrgaTermsOfServiceAccepted;
    this.pixCertifTermsOfServiceAccepted = pixCertifTermsOfServiceAccepted;
    this.organizationLearners = organizationLearners;
    this.authenticationMethods = authenticationMethods;
    this.createdAt = createdAt;
    this.lang = lang;
    this.lastTermsOfServiceValidatedAt = lastTermsOfServiceValidatedAt;
    this.lastPixOrgaTermsOfServiceValidatedAt = lastPixOrgaTermsOfServiceValidatedAt;
    this.lastPixCertifTermsOfServiceValidatedAt = lastPixCertifTermsOfServiceValidatedAt;
    this.lastLoggedAt = lastLoggedAt;
    this.emailConfirmedAt = emailConfirmedAt;
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = UserDetailsForAdmin;
