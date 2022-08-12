// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findPaginatedCampaignParticipantsActivities({
  userId,
  campaignId,
  page,
  filters,
  campaignRepository,
  campaignParticipantActivityRepository
}: $TSFixMe) {
  await _checkUserAccessToCampaign(campaignId, userId, campaignRepository);

  return campaignParticipantActivityRepository.findPaginatedByCampaignId({ page, campaignId, filters });
};

async function _checkUserAccessToCampaign(campaignId: $TSFixMe, userId: $TSFixMe, campaignRepository: $TSFixMe) {
  const hasAccess = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);
  if (!hasAccess) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to an organization that owns the campaign');
  }
}
