// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findCampaignProfilesCollectionParticipationSummaries({
  userId,
  campaignId,
  page,
  filters,
  campaignRepository,
  campaignProfilesCollectionParticipationSummaryRepository
}: $TSFixMe) {
  if (!(await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId))) {
    throw new UserNotAuthorizedToAccessEntityError('User does not belong to an organization that owns the campaign');
  }
  return campaignProfilesCollectionParticipationSummaryRepository.findPaginatedByCampaignId(campaignId, page, filters);
};
