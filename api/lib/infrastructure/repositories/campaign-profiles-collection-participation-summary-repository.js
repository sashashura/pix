const sumBy = require('lodash/sumBy');
const { knex } = require('../bookshelf');
const certificationProfileService = require('../../domain/services/certification-profile-service');
const CampaignProfilesCollectionParticipationSummary = require('../../domain/read-models/CampaignProfilesCollectionParticipationSummary');
const { fetchPage } = require('../utils/knex-utils');

const CampaignProfilesCollectionParticipationSummaryRepository = {

  async findPaginatedByCampaignId(campaignId, page) {
    const query = knex
      .select(
        'campaign-participations.id AS campaignParticipationId',
        'users.id as userId',
        'users.firstName',
        'users.lastName',
        'campaign-participations.participantExternalId',
        'campaign-participations.sharedAt',
      )
      .from('campaign-participations')
      .join('users', 'users.id', 'campaign-participations.userId')
      .join('campaigns', 'campaigns.id', 'campaign-participations.campaignId')
      .where('campaign-participations.campaignId', '=', campaignId)
      .orderByRaw('LOWER(??) ASC, LOWER(??) ASC', ['lastName', 'firstName']);

    const { results, pagination } = await fetchPage(query, page);

    const data = await Promise.all(results.map(
      async (result) => {
        if (!result.sharedAt) {
          return new CampaignProfilesCollectionParticipationSummary(result);
        }

        const certificationProfile = await certificationProfileService.getCertificationProfile({
          userId: result.userId,
          limitDate: result.sharedAt,
          allowExcessPixAndLevels: false
        });

        return new CampaignProfilesCollectionParticipationSummary({
          ...result,
          pixScore: sumBy(certificationProfile.userCompetences, 'pixScore'),
          certifiable: certificationProfile.isCertifiable(),
          certifiableCompetencesCount: certificationProfile.getCertifiableCompetencesCount(),
        });
      }
    ));

    return { data, pagination };
  }

};

module.exports = CampaignProfilesCollectionParticipationSummaryRepository;
