// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToAccessEntityError } = require('../errors');
// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function ({
  campaignId,
  userId,
  campaignParticipationsStatsRepository,
  campaignRepository
}: $TSFixMe) {
  await _checkUserPermission(campaignId, userId, campaignRepository);
  return campaignParticipationsStatsRepository.countParticipationsByMasteryRate({ campaignId });
};

async function _checkUserPermission(campaignId: $TSFixMe, userId: $TSFixMe, campaignRepository: $TSFixMe) {
  const hasAccess = await campaignRepository.checkIfUserOrganizationHasAccessToCampaign(campaignId, userId);

  if (!hasAccess) {
    throw new UserNotAuthorizedToAccessEntityError();
  }
}
