// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable '_'.
const _ = require('lodash');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCo... Remove this comment to see the full error message
const CampaignCollectiveResult = require('../../domain/read-models/CampaignCollectiveResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignPa... Remove this comment to see the full error message
const CampaignParticipationStatuses = require('../../domain/models/CampaignParticipationStatuses');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'constants'... Remove this comment to see the full error message
const constants = require('../constants');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SHARED'.
const { SHARED } = CampaignParticipationStatuses;

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getCampaignCollectiveResult(campaignId: $TSFixMe, targetProfileWithLearningContent: $TSFixMe) {
    const campaignCollectiveResult = new CampaignCollectiveResult({
      id: campaignId,
      targetProfile: targetProfileWithLearningContent,
    });

    const userIdsAndSharedDatesChunks = await _getChunksSharedParticipationsWithUserIdsAndDates(campaignId);

    let participantCount = 0;
    await bluebird.mapSeries(userIdsAndSharedDatesChunks, async (userIdsAndSharedDates: $TSFixMe) => {
      participantCount += userIdsAndSharedDates.length;
      const validatedTargetedKnowledgeElementsCountByCompetenceId =
        await knowledgeElementRepository.countValidatedTargetedByCompetencesForUsers(
          Object.fromEntries(userIdsAndSharedDates),
          targetProfileWithLearningContent
        );
      campaignCollectiveResult.addValidatedSkillCountToCompetences(
        validatedTargetedKnowledgeElementsCountByCompetenceId
      );
    });

    campaignCollectiveResult.finalize(participantCount);
    return campaignCollectiveResult;
  },
};

async function _getChunksSharedParticipationsWithUserIdsAndDates(campaignId: $TSFixMe) {
  const results = await knex('campaign-participations')
    .select('userId', 'sharedAt')
    .where({ campaignId, status: SHARED, isImproved: false, deletedAt: null });

  const userIdsAndDates = [];
  for (const result of results) {
    userIdsAndDates.push([result.userId, result.sharedAt]);
  }

  return _.chunk(userIdsAndDates, constants.CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING);
}
