// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Organizati... Remove this comment to see the full error message
const OrganizationInvitedUser = require('../../domain/models/OrganizationInvitedUser');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async get({
    organizationInvitationId,
    email
  }: $TSFixMe) {
    const invitation = await knex('organization-invitations')
      .select('id', 'organizationId', 'code', 'role', 'status')
      .where({ id: organizationInvitationId })
      .first();
    if (!invitation) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Not found organization-invitation for ID ${organizationInvitationId}`);
    }

    const user = await knex('users').select('id').where({ email }).first();
    if (!user) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`Not found user for email ${email}`);
    }

    const memberships = await knex('memberships')
      .select('id', 'userId', 'organizationRole')
      .where({
        organizationId: invitation.organizationId,
        disabledAt: null,
      })
      .orderBy('id', 'ASC');

    const existingMembership = memberships.find((membership: $TSFixMe) => membership.userId === user.id);

    return new OrganizationInvitedUser({
      userId: user.id,
      invitation,
      currentMembershipId: existingMembership?.id,
      currentRole: existingMembership?.organizationRole,
      organizationHasMemberships: memberships.length,
      status: invitation.status,
    });
  },

  async save({
    organizationInvitedUser
  }: $TSFixMe) {
    const date = new Date();

    if (organizationInvitedUser.isAlreadyMemberOfOrganization) {
      await knex('memberships')
        .update({
          organizationRole: organizationInvitedUser.currentRole,
          updatedAt: date,
        })
        .where({ id: organizationInvitedUser.currentMembershipId });
    } else {
      const [{ id: membershipId }] = await knex('memberships')
        .insert({
          organizationRole: organizationInvitedUser.currentRole,
          organizationId: organizationInvitedUser.invitation.organizationId,
          userId: organizationInvitedUser.userId,
        })
        .returning('id');

      organizationInvitedUser.currentMembershipId = membershipId;
    }

    await knex('user-orga-settings')
      .insert({
        userId: organizationInvitedUser.userId,
        currentOrganizationId: organizationInvitedUser.invitation.organizationId,
        updatedAt: new Date(),
      })
      .onConflict('userId')
      .merge();

    await knex('organization-invitations')
      .update({ status: organizationInvitedUser.status, updatedAt: date })
      .where({ id: organizationInvitedUser.invitation.id });
  },
};
