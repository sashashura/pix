// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserDetail... Remove this comment to see the full error message
const UserDetailsForAdmin = require('../../../../lib/domain/models/UserDetailsForAdmin');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildUserDetailsForAdmin({
  id = 123,
  firstName = 'Louis',
  lastName = 'Philippe',
  email = 'louis.philippe@example.net',
  username = 'jean.bono1234',
  cgu = true,
  pixCertifTermsOfServiceAccepted = false,
  pixOrgaTermsOfServiceAccepted = false,
  isAuthenticatedFromGAR = false,
  createdAt,
  lang,
  lastTermsOfServiceValidatedAt,
  lastPixOrgaTermsOfServiceValidatedAt,
  lastPixCertifTermsOfServiceValidatedAt,
  lastLoggedAt,
  emailConfirmedAt,
  organizationLearners = [],
  authenticationMethods = []
}: $TSFixMe = {}) {
  return new UserDetailsForAdmin({
    id,
    firstName,
    lastName,
    email,
    username,
    cgu,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    createdAt,
    lang,
    lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt,
    lastLoggedAt,
    emailConfirmedAt,
    isAuthenticatedFromGAR,
    organizationLearners,
    authenticationMethods,
  });
};
