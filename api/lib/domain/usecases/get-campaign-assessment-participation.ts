// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getCampaignAssessmentParticipation({
  userId,
  campaignId,
  campaignParticipationId,
  campaignRepository,
  campaignAssessmentParticipationRepository,
  badgeAcquisitionRepository
}: $TSFixMe) {
  if (!(await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId))) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to the organization that owns the campaign');
  }

  const campaignAssessmentParticipation =
    await campaignAssessmentParticipationRepository.getByCampaignIdAndCampaignParticipationId({
      campaignId,
      campaignParticipationId,
    });

  const acquiredBadgesByCampaignParticipations =
    await badgeAcquisitionRepository.getAcquiredBadgesByCampaignParticipations({
      campaignParticipationsIds: [campaignParticipationId],
    });
  const badges = acquiredBadgesByCampaignParticipations[campaignAssessmentParticipation.campaignParticipationId];
  campaignAssessmentParticipation.setBadges(badges);

  return campaignAssessmentParticipation;
};
