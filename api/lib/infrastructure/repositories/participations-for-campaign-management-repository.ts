// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'Participat... Remove this comment to see the full error message
const ParticipationForCampaignManagement = require('../../domain/models/ParticipationForCampaignManagement');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'fetchPage'... Remove this comment to see the full error message
const { fetchPage } = require('../utils/knex-utils');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../domain/errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async findPaginatedParticipationsForCampaignManagement({
    campaignId,
    page
  }: $TSFixMe) {
    const query = knex('campaign-participations')
      .select({
        id: 'campaign-participations.id',
        lastName: 'organization-learners.lastName',
        firstName: 'organization-learners.firstName',
        userId: 'users.id',
        userFirstName: 'users.firstName',
        userLastName: 'users.lastName',
        participantExternalId: 'campaign-participations.participantExternalId',
        status: 'campaign-participations.status',
        createdAt: 'campaign-participations.createdAt',
        sharedAt: 'campaign-participations.sharedAt',
        deletedAt: 'campaign-participations.deletedAt',
        deletedBy: 'deletedByUsers.id',
        deletedByFirstName: 'deletedByUsers.firstName',
        deletedByLastName: 'deletedByUsers.lastName',
      })
      .join('organization-learners', 'organization-learners.id', 'campaign-participations.organizationLearnerId')
      .leftJoin('users as deletedByUsers', 'deletedByUsers.id', 'campaign-participations.deletedBy')
      .innerJoin('users', 'users.id', 'campaign-participations.userId')
      .where('campaignId', campaignId)
      .orderBy(['lastName', 'firstName'], ['asc', 'asc']);

    const { results, pagination } = await fetchPage(query, page);

    const participationsForCampaignManagement = results.map(
      (attributes: $TSFixMe) => new ParticipationForCampaignManagement(attributes)
    );
    return { models: participationsForCampaignManagement, meta: { ...pagination } };
  },

  async updateParticipantExternalId({
    campaignParticipationId,
    participantExternalId
  }: $TSFixMe) {
    try {
      await knex('campaign-participations').where('id', campaignParticipationId).update({ participantExternalId });
    } catch (error) {
      // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
      throw new NotFoundError(`La participation avec l'id ${campaignParticipationId} n'existe pas.`);
    }
  },
};
