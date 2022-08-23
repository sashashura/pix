module.exports = async function updateCampaignCountsAfterDeleteParticipation({
  campaignId,
  deletedCampaignParticipations,
  domainTransaction,
  campaignRepository,
}) {
  await campaignRepository.decrementParticipationsCount(campaignId, domainTransaction);

  if (deletedCampaignParticipations.some((campaignParticipation) => campaignParticipation.sharedAt)) {
    await campaignRepository.decrementSharedParticipationsCount(campaignId, domainTransaction);
  }
};
