// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserOrgaSe... Remove this comment to see the full error message
const UserOrgaSettings = require('../../../../lib/domain/models/UserOrgaSettings');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Prescriber... Remove this comment to see the full error message
const Prescriber = require('../../../../lib/domain/read-models/Prescriber');

/*
 * /!\ We can not use standard entity builders because of bidirectional relationships (a.k.a. cyclic dependencies)
 */

function _buildUser() {
  return new User({
    id: 123,
    firstName: 'Coucou',
    lastName: 'Cémoi',
  });
}

function _buildOrganization() {
  return new Organization({
    id: 456,
    name: 'ACME',
    type: 'PRO',
    externalId: 'EXTID',
    isManagingStudents: false,
  });
}

function _buildMemberships() {
  return [
    new Membership({
      id: 789,
      user: _buildUser(),
      organization: _buildOrganization(),
    }),
  ];
}

function _buildUserOrgaSettings() {
  return new UserOrgaSettings({
    id: 159,
    currentOrganization: _buildOrganization(),
    user: _buildUser(),
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildPrescriber({
  id = 753,
  firstName = 'Jean',
  lastName = 'Forme',
  pixOrgaTermsOfServiceAccepted = false,
  lang = 'fr',
  areNewYearOrganizationLearnersImported = false,
  memberships = _buildMemberships(),
  userOrgaSettings = _buildUserOrgaSettings(),
} = {}) {
  return new Prescriber({
    id,
    firstName,
    lastName,
    pixOrgaTermsOfServiceAccepted,
    lang,
    areNewYearOrganizationLearnersImported,
    memberships,
    userOrgaSettings,
  });
};
