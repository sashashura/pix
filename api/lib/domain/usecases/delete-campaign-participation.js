const bluebird = require('bluebird');

module.exports = async function deleteCampaignParticipation({
  userId,
  campaignId,
  domainTransaction,
  campaignParticipationId,
  campaignParticipationRepository,
}) {
  const campaignParticipations =
    await campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner({
      campaignId,
      campaignParticipationId,
      domainTransaction,
    });

  await bluebird.mapSeries(campaignParticipations, async (campaignParticipation) => {
    campaignParticipation.delete(userId);
    const { id, deletedAt, deletedBy } = campaignParticipation;
    await campaignParticipationRepository.markAsDeleted({ id, deletedAt, deletedBy, domainTransaction });
  });
};
