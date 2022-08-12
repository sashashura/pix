// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPr... Remove this comment to see the full error message
const CampaignProfile = require('../../../lib/domain/read-models/CampaignProfile');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'placementP... Remove this comment to see the full error message
const placementProfileService = require('../../domain/services/placement-profile-service');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findProfile({
    campaignId,
    campaignParticipationId,
    locale
  }: $TSFixMe) {
    const profile = await _fetchCampaignProfileAttributesFromCampaignParticipation(campaignId, campaignParticipationId);

    const { sharedAt, userId } = profile;
    const placementProfile = await placementProfileService.getPlacementProfile({
      userId,
      limitDate: sharedAt,
      allowExcessPixAndLevels: false,
      locale,
    });

    return new CampaignProfile({ ...profile, placementProfile });
  },
};

async function _fetchCampaignProfileAttributesFromCampaignParticipation(campaignId: $TSFixMe, campaignParticipationId: $TSFixMe) {
  const [profile] = await knex
    .with('campaignProfile', (qb: $TSFixMe) => {
      qb.select([
        'campaign-participations.userId',
        'organization-learners.firstName',
        'organization-learners.lastName',
        'campaign-participations.id AS campaignParticipationId',
        'campaign-participations.campaignId',
        'campaign-participations.createdAt',
        'campaign-participations.sharedAt',
        'campaign-participations.status',
        'campaign-participations.participantExternalId',
        'campaign-participations.pixScore',
      ])
        .from('campaign-participations')
        .join('organization-learners', 'organization-learners.id', 'campaign-participations.organizationLearnerId')
        .where({
          campaignId,
          'campaign-participations.id': campaignParticipationId,
          'campaign-participations.deletedAt': null,
        });
    })
    .from('campaignProfile');

  if (profile == null) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`There is no campaign participation with the id "${campaignParticipationId}"`);
  }

  return profile;
}
