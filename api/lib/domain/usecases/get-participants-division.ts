// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'ForbiddenA... Remove this comment to see the full error message
const { ForbiddenAccess } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getParticipantsDivision({
  userId,
  campaignId,
  campaignRepository,
  divisionRepository
}: $TSFixMe) {
  if (!(await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId))) {
    throw new ForbiddenAccess();
  }
  return divisionRepository.findByCampaignId(campaignId);
};
