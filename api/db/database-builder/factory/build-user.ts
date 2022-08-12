// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isNil'.
const isNil = require('lodash/isNil');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'isUndefine... Remove this comment to see the full error message
const isUndefined = require('lodash/isUndefined');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'databaseBu... Remove this comment to see the full error message
const databaseBuffer = require('../database-buffer');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Authentica... Remove this comment to see the full error message
const AuthenticationMethod = require('../../../lib/domain/models/AuthenticationMethod');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../lib/domain/models/Membership');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'encrypt'.
const encrypt = require('../../../lib/domain/services/encryption-service');

// @ts-expect-error TS(2580): Cannot find name 'require'. Do you need to install... Remove this comment to see the full error message
const buildPixAdminRole = require('./build-pix-admin-role');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildOrgan... Remove this comment to see the full error message
const buildOrganization = require('./build-organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildMembe... Remove this comment to see the full error message
const buildMembership = require('./build-membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCenter = require('./build-certification-center');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'buildCerti... Remove this comment to see the full error message
const buildCertificationCenterMembership = require('./build-certification-center-membership');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'DEFAULT_PA... Remove this comment to see the full error message
const { DEFAULT_PASSWORD } = require('../../seeds/data/users-builder');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ROLES'.
const { ROLES } = require('../../../lib/domain/constants').PIX_ADMIN;

function _buildPixAuthenticationMethod({
  id = databaseBuffer.getNextId(),
  userId,
  rawPassword = DEFAULT_PASSWORD,
  shouldChangePassword,
  createdAt,
  updatedAt
}: $TSFixMe = {}) {
  // eslint-disable-next-line no-sync
  const hashedPassword = encrypt.hashPasswordSync(rawPassword);

  const values = {
    id,
    userId,
    identityProvider: AuthenticationMethod.identityProviders.PIX,
    authenticationComplement: new AuthenticationMethod.PixAuthenticationComplement({
      password: hashedPassword,
      shouldChangePassword,
    }),
    externalIdentifier: undefined,
    createdAt,
    updatedAt,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'authentication-methods',
    values,
  });
}

const buildUser = function buildUser({
  id = databaseBuffer.getNextId(),
  firstName = 'Billy',
  lastName = 'TheKid',
  email,
  username = `${firstName}.${lastName}.${id}`,
  cgu = true,
  lang = 'fr',
  lastTermsOfServiceValidatedAt = null,
  lastPixOrgaTermsOfServiceValidatedAt = null,
  lastPixCertifTermsOfServiceValidatedAt = null,
  mustValidateTermsOfService = false,
  pixOrgaTermsOfServiceAccepted = false,
  pixCertifTermsOfServiceAccepted = false,
  hasSeenAssessmentInstructions = false,
  hasSeenNewDashboardInfo = false,
  hasSeenFocusedChallengeTooltip = false,
  hasSeenOtherChallengesTooltip = false,
  isAnonymous = false,
  createdAt = new Date(),
  updatedAt = new Date(),
  lastLoggedAt = new Date(),
  emailConfirmedAt = null
}: $TSFixMe = {}) {
  email = isUndefined(email) ? `${firstName}.${lastName}${id}@example.net`.toLowerCase() : email || null;

  const values = {
    id,
    firstName,
    lastName,
    email,
    username,
    cgu,
    lang,
    lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt,
    mustValidateTermsOfService,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    hasSeenAssessmentInstructions,
    hasSeenNewDashboardInfo,
    hasSeenFocusedChallengeTooltip,
    hasSeenOtherChallengesTooltip,
    isAnonymous,
    createdAt,
    updatedAt,
    lastLoggedAt,
    emailConfirmedAt,
  };

  return databaseBuffer.pushInsertable({
    tableName: 'users',
    values,
  });
};

buildUser.withRawPassword = function buildUserWithRawPassword({
  id = databaseBuffer.getNextId(),
  firstName = 'Billy',
  lastName = 'TheKid',
  email,
  username,
  cgu = true,
  lang = 'fr',
  lastTermsOfServiceValidatedAt = new Date('2019-04-28T02:42:00Z'),
  lastPixOrgaTermsOfServiceValidatedAt = null,
  lastPixCertifTermsOfServiceValidatedAt = null,
  mustValidateTermsOfService = false,
  pixOrgaTermsOfServiceAccepted = false,
  pixCertifTermsOfServiceAccepted = false,
  hasSeenAssessmentInstructions = false,
  createdAt = new Date(),
  updatedAt = new Date(),
  rawPassword = DEFAULT_PASSWORD,
  shouldChangePassword = false,
  lastLoggedAt = new Date('2022-04-28T02:42:00Z'),
  emailConfirmedAt = new Date('2021-04-28T02:42:00Z')
}: $TSFixMe = {}) {
  email = isUndefined(email) ? `${firstName}.${lastName}${id}@example.net`.toLowerCase() : email || null;

  const values = {
    id,
    firstName,
    lastName,
    email,
    username,
    cgu,
    lang,
    lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt,
    mustValidateTermsOfService,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    hasSeenAssessmentInstructions,
    createdAt,
    updatedAt,
    lastLoggedAt,
    emailConfirmedAt,
  };

  const user = databaseBuffer.pushInsertable({
    tableName: 'users',
    values,
  });

  _buildPixAuthenticationMethod({
    userId: user.id,
    rawPassword,
    shouldChangePassword,
    createdAt,
    updatedAt,
  });

  return user;
};

buildUser.withRole = function buildUserWithRole({
  id = databaseBuffer.getNextId(),
  firstName = 'Billy',
  lastName = 'TheKid',
  role = ROLES.SUPER_ADMIN,
  email,
  cgu = true,
  lang = 'fr',
  lastTermsOfServiceValidatedAt,
  lastPixOrgaTermsOfServiceValidatedAt = null,
  lastPixCertifTermsOfServiceValidatedAt = null,
  mustValidateTermsOfService = false,
  pixOrgaTermsOfServiceAccepted = false,
  pixCertifTermsOfServiceAccepted = false,
  hasSeenAssessmentInstructions = false,
  createdAt = new Date(),
  updatedAt = new Date(),
  disabledAt,
  rawPassword = DEFAULT_PASSWORD,
  shouldChangePassword = false
}: $TSFixMe = {}) {
  email = isUndefined(email) ? `${firstName}.${lastName}${id}@example.net`.toLowerCase() : email || null;

  const values = {
    id,
    firstName,
    lastName,
    email,
    cgu,
    lang,
    lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt,
    mustValidateTermsOfService,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    hasSeenAssessmentInstructions,
  };

  const user = databaseBuffer.pushInsertable({
    tableName: 'users',
    values,
  });

  _buildPixAuthenticationMethod({
    userId: user.id,
    rawPassword,
    shouldChangePassword,
    createdAt,
    updatedAt,
  });

  buildPixAdminRole({ userId: user.id, role, disabledAt, createdAt, updatedAt });

  return user;
};

buildUser.withMembership = function buildUserWithMemberships({
  id = databaseBuffer.getNextId(),
  firstName = 'Billy',
  lastName = 'TheKid',
  email,
  cgu = true,
  lang = 'fr',
  lastTermsOfServiceValidatedAt,
  lastPixOrgaTermsOfServiceValidatedAt = null,
  lastPixCertifTermsOfServiceValidatedAt = null,
  mustValidateTermsOfService,
  pixOrgaTermsOfServiceAccepted = false,
  pixCertifTermsOfServiceAccepted = false,
  hasSeenAssessmentInstructions = false,
  createdAt = new Date(),
  updatedAt = new Date(),
  organizationRole = Membership.roles.ADMIN,
  organizationId = null,
  rawPassword = DEFAULT_PASSWORD,
  shouldChangePassword = false
}: $TSFixMe = {}) {
  email = isUndefined(email) ? `${firstName}.${lastName}${id}@example.net`.toLowerCase() : email || null;

  const values = {
    id,
    firstName,
    lastName,
    email,
    cgu,
    lang,
    lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt,
    mustValidateTermsOfService,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    hasSeenAssessmentInstructions,
  };

  const user = databaseBuffer.pushInsertable({
    tableName: 'users',
    values,
  });

  _buildPixAuthenticationMethod({
    userId: user.id,
    rawPassword,
    shouldChangePassword,
    createdAt,
    updatedAt,
  });

  organizationId = isNil(organizationId) ? buildOrganization().id : organizationId;

  buildMembership({
    userId: user.id,
    organizationId,
    organizationRole,
  });

  return user;
};

buildUser.withCertificationCenterMembership = function buildUserWithCertificationCenterMembership({
  id = databaseBuffer.getNextId(),
  firstName = 'Billy',
  lastName = 'TheKid',
  email,
  username = `${firstName}.${lastName}.${id}`,
  cgu = true,
  lang = 'fr',
  lastTermsOfServiceValidatedAt = null,
  lastPixOrgaTermsOfServiceValidatedAt = null,
  lastPixCertifTermsOfServiceValidatedAt = null,
  mustValidateTermsOfService = false,
  pixOrgaTermsOfServiceAccepted = false,
  pixCertifTermsOfServiceAccepted = false,
  hasSeenAssessmentInstructions = false,
  createdAt = new Date(),
  updatedAt = new Date(),
  certificationCenterId = null
}: $TSFixMe = {}) {
  email = isUndefined(email) ? `${firstName}.${lastName}${id}@example.net`.toLowerCase() : email || null;

  const user = buildUser({
    id,
    firstName,
    lastName,
    username,
    email,
    cgu,
    lang,
    lastTermsOfServiceValidatedAt,
    lastPixOrgaTermsOfServiceValidatedAt,
    lastPixCertifTermsOfServiceValidatedAt,
    mustValidateTermsOfService,
    pixOrgaTermsOfServiceAccepted,
    pixCertifTermsOfServiceAccepted,
    hasSeenAssessmentInstructions,
    createdAt,
    updatedAt,
  });

  certificationCenterId = isNil(certificationCenterId) ? buildCertificationCenter().id : certificationCenterId;

  buildCertificationCenterMembership({
    userId: user.id,
    certificationCenterId,
  });

  return user;
};

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = buildUser;
