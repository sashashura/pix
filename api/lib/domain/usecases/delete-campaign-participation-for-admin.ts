// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'bluebird'.
const bluebird = require('bluebird');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function deleteCampaignParticipationForAdmin({
  userId,
  campaignParticipationId,
  domainTransaction,
  campaignRepository,
  campaignParticipationRepository
}: $TSFixMe) {
  const campaignId = await campaignRepository.getCampaignIdByCampaignParticipationId(campaignParticipationId);

  const campaignParticipations =
    await campaignParticipationRepository.getAllCampaignParticipationsInCampaignForASameLearner({
      campaignId,
      campaignParticipationId,
      domainTransaction,
    });

  await bluebird.mapSeries(campaignParticipations, async (campaignParticipation: $TSFixMe) => {
    campaignParticipation.delete(userId);
    const { id, deletedAt, deletedBy } = campaignParticipation;
    await campaignParticipationRepository.delete({ id, deletedAt, deletedBy, domainTransaction });
  });
};
