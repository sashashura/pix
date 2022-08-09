module.exports = async function deleteCampaignParticipationForAdmin({
  userId,
  campaignParticipationId,
  domainTransaction,
  campaignRepository,
  campaignParticipationRepository,
  campaignParticipantRepository,
}) {
  const campaignId = await campaignRepository.getCampaignIdByCampaignParticipationId(campaignParticipationId);

  const organizationLearnerId = await campaignParticipationRepository.getOrganizationLearnerIdFromCampaignParticipation(
    {
      campaignId,
      campaignParticipationId,
      domainTransaction,
    }
  );
  await campaignParticipantRepository.delete({
    userId,
    campaignId,
    organizationLearnerId,
    domainTransaction,
  });
};
