module.exports = async function incrementCampaignParticipationCounter({
  campaignParticipation,
  domainTransaction,
  campaignRepository,
  campaignParticipationRepository,
}) {
  const isRetrying = await campaignParticipationRepository.isRetrying({
    campaignParticipationId: campaignParticipation.id,
    domainTransaction,
  });
  if (!isRetrying) {
    return campaignRepository.incrementParticipationsCount(campaignParticipation.campaignId, domainTransaction);
  }
};
