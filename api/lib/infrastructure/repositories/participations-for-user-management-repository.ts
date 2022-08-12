// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../../../db/knex-database-connection');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationForUserManagement = require('../../domain/read-models/CampaignParticipationForUserManagement');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findByUserId(userId: $TSFixMe) {
    const campaignParticipations = await knex('campaign-participations')
      .select({
        id: 'campaign-participations.id',
        participantExternalId: 'campaign-participations.participantExternalId',
        status: 'campaign-participations.status',
        campaignId: 'campaigns.id',
        campaignCode: 'campaigns.code',
        createdAt: 'campaign-participations.createdAt',
        sharedAt: 'campaign-participations.sharedAt',
        deletedAt: 'campaign-participations.deletedAt',
        deletedBy: 'deletedByUsers.id',
        deletedByFirstName: 'deletedByUsers.firstName',
        deletedByLastName: 'deletedByUsers.lastName',
        organizationLearnerFirstName: 'organization-learners.firstName',
        organizationLearnerLastName: 'organization-learners.lastName',
      })
      .innerJoin('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
      .innerJoin('organization-learners', 'organization-learners.id', 'campaign-participations.organizationLearnerId')
      .leftJoin('users as deletedByUsers', 'deletedByUsers.id', 'campaign-participations.deletedBy')
      .where('campaign-participations.userId', userId)
      .orderBy('createdAt', 'desc');

    return campaignParticipations.map((attributes: $TSFixMe) => new CampaignParticipationForUserManagement(attributes));
  },
};
