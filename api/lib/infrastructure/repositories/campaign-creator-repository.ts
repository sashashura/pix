// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCr... Remove this comment to see the full error message
const CampaignCreator = require('../../../lib/domain/models/CampaignCreator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToCreateCampaignError } = require('../../domain/errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'get'.
async function get({
  userId,
  organizationId,
  ownerId
}: $TSFixMe) {
  await _checkUserIsAMemberOfOrganization({ organizationId, userId });
  await _checkOwnerIsAMemberOfOrganization({ organizationId, ownerId });

  const availableTargetProfiles = await knex('target-profiles')
    .leftJoin('target-profile-shares', 'targetProfileId', 'target-profiles.id')
    .where({ outdated: false })
    .andWhere((queryBuilder: $TSFixMe) => {
      queryBuilder
        .where({ isPublic: true })
        .orWhere({ ownerOrganizationId: organizationId })
        .orWhere({ organizationId });
    })
    .pluck('target-profiles.id');
  return new CampaignCreator(availableTargetProfiles);
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  get,
};

async function _checkUserIsAMemberOfOrganization({
  organizationId,
  userId
}: $TSFixMe) {
  const membership = await knex('memberships').where({ organizationId, userId }).first();
  if (!membership) {
    throw new UserNotAuthorizedToCreateCampaignError(
      `User does not have an access to the organization ${organizationId}`
    );
  }
}

async function _checkOwnerIsAMemberOfOrganization({
  organizationId,
  ownerId
}: $TSFixMe) {
  const membership = await knex('memberships').where({ organizationId, userId: ownerId }).first();
  if (!membership) {
    throw new UserNotAuthorizedToCreateCampaignError(
      `Owner does not have an access to the organization ${organizationId}`
    );
  }
}
