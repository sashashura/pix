// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = function findPaginatedParticipationsForCampaignManagement({
  campaignId,
  page,
  participationsForCampaignManagementRepository
}: $TSFixMe) {
  return participationsForCampaignManagementRepository.findPaginatedParticipationsForCampaignManagement({
    campaignId,
    page,
  });
};
