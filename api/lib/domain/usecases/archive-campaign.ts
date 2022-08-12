// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToUpdateCampaignError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function archiveCampaign({
  // Parameters
  campaignId,

  userId,

  // Repositories
  campaignRepository
}: $TSFixMe) {
  const isUserCampaignAdmin = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);
  if (!isUserCampaignAdmin) {
    throw new UserNotAuthorizedToUpdateCampaignError();
  }

  return campaignRepository.update({ id: campaignId, archivedAt: new Date() });
};
