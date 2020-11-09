const Assessment = require('../models/Assessment');
const { AlreadySharedCampaignParticipationError, UserNotAuthorizedToAccessEntity } = require('../../domain/errors');

module.exports = async function beginCampaignParticipationImprovement({
  campaignParticipationId,
  userId,
  assessmentRepository,
  campaignParticipationRepository,
}) {

  const campaignParticipation = await campaignParticipationRepository.get(campaignParticipationId, { });
  if (campaignParticipation.userId !== userId) {
    throw new UserNotAuthorizedToAccessEntity();
  }

  const assessment = campaignParticipation.createImprovementAssessment();
  return assessmentRepository.save({ assessment });

};
