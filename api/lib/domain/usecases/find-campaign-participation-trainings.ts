// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToFindTrainings } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findCampaignParticipationTrainings({
  userId,
  campaignParticipationId,
  locale,
  campaignParticipationRepository,
  campaignRepository,
  trainingRepository
}: $TSFixMe) {
  const campaignParticipation = await campaignParticipationRepository.get(campaignParticipationId);

  if (campaignParticipation.userId !== userId) throw new UserNotAuthorizedToFindTrainings();

  const { targetProfile } = await campaignRepository.get(campaignParticipation.campaign.id);

  if (!targetProfile) {
    return [];
  }

  return trainingRepository.findByTargetProfileIdAndLocale({
    targetProfileId: targetProfile.id,
    locale,
  });
};
