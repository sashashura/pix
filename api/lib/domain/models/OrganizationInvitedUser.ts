// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'AlreadyExi... Remove this comment to see the full error message
const { AlreadyExistingMembershipError } = require('../../domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError, AlreadyAcceptedOrCancelledOrganizationInvitationError } = require('../errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'roles'.
const { roles } = require('./Membership');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitation = require('./OrganizationInvitation');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
class OrganizationInvitedUser {
  currentMembershipId: $TSFixMe;
  currentRole: $TSFixMe;
  invitation: $TSFixMe;
  organizationHasMemberships: $TSFixMe;
  status: $TSFixMe;
  userId: $TSFixMe;
  constructor({
    userId,
    invitation,
    currentRole,
    organizationHasMemberships,
    currentMembershipId,
    status
  }: $TSFixMe = {}) {
    this.userId = userId;
    this.invitation = invitation;
    this.currentRole = currentRole;
    this.organizationHasMemberships = organizationHasMemberships;
    this.currentMembershipId = currentMembershipId;
    this.status = status;
  }

  acceptInvitation({
    code
  }: $TSFixMe) {
    if (code !== this.invitation.code) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Not found organization-invitation for ID ${this.invitation.id} and code ${code}`);
    }

    if (this.status !== 'pending') {
      throw new AlreadyAcceptedOrCancelledOrganizationInvitationError();
    }

    if (this.currentRole && !this.invitation.role) {
      throw new AlreadyExistingMembershipError(
        `User is already member of organisation ${this.invitation.organizationId}`
      );
    }

    this.currentRole = this.invitation.role || this._pickDefaultRole();

    this.status = OrganizationInvitation.StatusType.ACCEPTED;
  }

  _pickDefaultRole() {
    return this.organizationHasMemberships ? roles.MEMBER : roles.ADMIN;
  }

  get isAlreadyMemberOfOrganization() {
    return Boolean(this.currentMembershipId);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = OrganizationInvitedUser;
