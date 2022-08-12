// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InvalidMem... Remove this comment to see the full error message
const { InvalidMembershipOrganizationRoleError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'roles'.
const roles = {
  ADMIN: 'ADMIN',
  MEMBER: 'MEMBER',
};

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Membership... Remove this comment to see the full error message
class Membership {
  static roles = roles;

  id: $TSFixMe;
  organization: $TSFixMe;
  organizationRole: $TSFixMe;
  updatedByUserId: $TSFixMe;
  user: $TSFixMe;

  constructor({
    id,
    organizationRole = roles.MEMBER,
    updatedByUserId,
    organization,
    user
  }: $TSFixMe = {}) {
    this.id = id;
    this.organizationRole = organizationRole;
    this.updatedByUserId = updatedByUserId;
    this.organization = organization;
    this.user = user;
  }

  get isAdmin() {
    return this.organizationRole === roles.ADMIN;
  }

  validateRole() {
    const isRoleValid = Object.values(roles).includes(this.organizationRole);
    if (!isRoleValid) {
      throw new InvalidMembershipOrganizationRoleError();
    }
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = Membership;
