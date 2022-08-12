// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findLatestOngoingUserCampaignParticipations({
  userId,
  campaignParticipationRepository
}: $TSFixMe) {
  return campaignParticipationRepository.findLatestOngoingByUserId(userId);
};
