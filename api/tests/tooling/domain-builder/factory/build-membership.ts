// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
const Membership = require('../../../../lib/domain/models/Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const Organization = require('../../../../lib/domain/models/Organization');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'User'.
const User = require('../../../../lib/domain/models/User');

/*
 * /!\ We can not use standard entity builders because of bidirectional relationships (a.k.a. cyclic dependencies)
 */

function _buildUser() {
  return new User({
    id: 159,
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@example.net',
  });
}

// @ts-expect-error TS(2393): Duplicate function implementation.
function _buildOrganization() {
  return new Organization({
    id: 753,
    name: 'ACME',
    type: 'PRO',
    externalId: 'EXTID',
    isManagingStudents: false,
  });
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function buildMembership({
  id = 123,
  organization = _buildOrganization(),
  organizationRole = Membership.roles.MEMBER,
  user = _buildUser(),
} = {}) {
  const membership = new Membership({ id, organization, organizationRole, user });

  membership.user.memberships.push(membership);

  return membership;
};
