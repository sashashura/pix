// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignAs... Remove this comment to see the full error message
const CampaignAssessmentParticipationResult = require('../../../lib/domain/read-models/CampaignAssessmentParticipationResult');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NotFoundEr... Remove this comment to see the full error message
const { NotFoundError } = require('../../../lib/domain/errors');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knex'.
const { knex } = require('../bookshelf');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'knowledgeE... Remove this comment to see the full error message
const knowledgeElementRepository = require('./knowledge-element-repository');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'targetProf... Remove this comment to see the full error message
const targetProfileWithLearningContentRepository = require('./target-profile-with-learning-content-repository');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = {
  async getByCampaignIdAndCampaignParticipationId({
    campaignId,
    campaignParticipationId,
    locale
  }: $TSFixMe) {
    const targetProfileWithLearningContent = await targetProfileWithLearningContentRepository.getByCampaignId({
      campaignId,
      locale,
    });

    const result = await _fetchCampaignAssessmentParticipationResultAttributesFromCampaignParticipation(
      campaignId,
      campaignParticipationId
    );

    return _buildCampaignAssessmentParticipationResults(result, targetProfileWithLearningContent);
  },
};

async function _fetchCampaignAssessmentParticipationResultAttributesFromCampaignParticipation(
  campaignId: $TSFixMe,
  campaignParticipationId: $TSFixMe
) {
  const [campaignAssessmentParticipationResult] = await knex
    .with('campaignAssessmentParticipationResult', (qb: $TSFixMe) => {
      qb.select([
        'users.id AS userId',
        'campaign-participations.id AS campaignParticipationId',
        'campaign-participations.campaignId',
        'campaign-participations.sharedAt',
        'campaign-participations.status',
      ])
        .from('campaign-participations')
        .join('assessments', 'assessments.campaignParticipationId', 'campaign-participations.id')
        .join('users', 'users.id', 'campaign-participations.userId')
        .leftJoin('campaigns', 'campaign-participations.campaignId', 'campaigns.id')
        .where({
          campaignId,
          'campaign-participations.id': campaignParticipationId,
          'campaign-participations.deletedAt': null,
        });
    })
    .from('campaignAssessmentParticipationResult');

  if (campaignAssessmentParticipationResult == null) {
    // @ts-expect-error TS(2554): Expected 3 arguments, but got 1.
    throw new NotFoundError(`There is no campaign participation with the id "${campaignParticipationId}"`);
  }

  return campaignAssessmentParticipationResult;
}

async function _buildCampaignAssessmentParticipationResults(result: $TSFixMe, targetProfileWithLearningContent: $TSFixMe) {
  const validatedTargetedKnowledgeElementsCountByCompetenceId =
    await knowledgeElementRepository.countValidatedTargetedByCompetencesForOneUser(
      result.userId,
      result.sharedAt,
      targetProfileWithLearningContent
    );

  return new CampaignAssessmentParticipationResult({
    ...result,
    targetedCompetences: targetProfileWithLearningContent.competences,
    validatedTargetedKnowledgeElementsCountByCompetenceId,
    targetProfile: targetProfileWithLearningContent,
  });
}
