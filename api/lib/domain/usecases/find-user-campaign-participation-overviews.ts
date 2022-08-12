// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function findUserCampaignParticipationOverviews({
  userId,
  states,
  page,
  campaignParticipationOverviewRepository
}: $TSFixMe) {
  const concatenatedStates = states ? [].concat(states) : undefined;

  const campaignParticipationOverviews = await campaignParticipationOverviewRepository.findByUserIdWithFilters({
    userId,
    states: concatenatedStates,
    page,
  });

  return campaignParticipationOverviews;
};
