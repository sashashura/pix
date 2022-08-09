module.exports = async function deleteCampaignParticipation({
  campaignId,
  campaignParticipantRepository,
  campaignParticipationId,
  campaignParticipationRepository,
  domainTransaction,
  userId,
}) {
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
