// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAn... Remove this comment to see the full error message
const CampaignAnalysis = require('../../domain/read-models/CampaignAnalysis');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getCampaignAnalysis(campaignId: $TSFixMe, targetProfileWithLearningContent: $TSFixMe, tutorials: $TSFixMe) {
    const userIdsAndSharedDates = await _getSharedParticipationsWithUserIdsAndDates(campaignId);
    const userIdsAndSharedDatesChunks = _.chunk(userIdsAndSharedDates, constants.CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING);
    const participantCount = userIdsAndSharedDates.length;

    const campaignAnalysis = new CampaignAnalysis({
      campaignId,
      targetProfileWithLearningContent,
      tutorials,
      participantCount,
    });

    await bluebird.mapSeries(userIdsAndSharedDatesChunks, async (userIdsAndSharedDates: $TSFixMe) => {
      const knowledgeElementsByTube = await knowledgeElementRepository.findValidatedTargetedGroupedByTubes(
        Object.fromEntries(userIdsAndSharedDates),
        targetProfileWithLearningContent
      );
      campaignAnalysis.addToTubeRecommendations({ knowledgeElementsByTube });
    });
    campaignAnalysis.finalize();
    return campaignAnalysis;
  },

  async getCampaignParticipationAnalysis(
    campaignId: $TSFixMe,
    campaignParticipation: $TSFixMe,
    targetProfileWithLearningContent: $TSFixMe,
    tutorials: $TSFixMe
  ) {
    const campaignAnalysis = new CampaignAnalysis({
      campaignId,
      targetProfileWithLearningContent,
      tutorials,
      participantCount: 1,
    });

    const knowledgeElementsByTube = await knowledgeElementRepository.findValidatedTargetedGroupedByTubes(
      { [campaignParticipation.userId]: campaignParticipation.sharedAt },
      targetProfileWithLearningContent
    );
    campaignAnalysis.addToTubeRecommendations({ knowledgeElementsByTube });

    // @ts-expect-error TS(2554): Expected 0 arguments, but got 1.
    campaignAnalysis.finalize(1);
    return campaignAnalysis;
  },
};

async function _getSharedParticipationsWithUserIdsAndDates(campaignId: $TSFixMe) {
  const results = await knex('campaign-participations')
    .select('userId', 'sharedAt')
    .where({ campaignId, status: SHARED, isImproved: false, deletedAt: null });

  const userIdsAndDates = [];
  for (const result of results) {
    userIdsAndDates.push([result.userId, result.sharedAt]);
  }

  return userIdsAndDates;
}
