// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getParticipantsGroup({
  userId,
  campaignId,
  campaignRepository,
  groupRepository
}: $TSFixMe) {
  if (!(await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId))) {
    throw new ForbiddenAccess();
  }
  return groupRepository.findByCampaignId(campaignId);
};
