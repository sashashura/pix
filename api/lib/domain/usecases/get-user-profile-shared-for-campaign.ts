// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'SharedProf... Remove this comment to see the full error message
const SharedProfileForCampaign = require('../read-models/SharedProfileForCampaign');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'NoCampaign... Remove this comment to see the full error message
const { NoCampaignParticipationForUserAndCampaign } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function getUserProfileSharedForCampaign({
  userId,
  campaignId,
  campaignParticipationRepository,
  campaignRepository,
  knowledgeElementRepository,
  competenceRepository,
  organizationLearnerRepository,
  locale
}: $TSFixMe) {
  const campaignParticipation = await campaignParticipationRepository.findOneByCampaignIdAndUserId({
    campaignId,
    userId,
  });

  if (!campaignParticipation) {
    throw new NoCampaignParticipationForUserAndCampaign();
  }

  const [
    { multipleSendings: campaignAllowsRetry },
    isOrganizationLearnerActive,
    competencesWithArea,
    knowledgeElementsGroupedByCompetenceId,
  ] = await Promise.all([
    campaignRepository.get(campaignId),
    organizationLearnerRepository.isActive({ campaignId, userId }),
    competenceRepository.listPixCompetencesOnly({ locale }),
    await knowledgeElementRepository.findUniqByUserIdGroupedByCompetenceId({
      userId,
      limitDate: campaignParticipation.sharedAt,
    }),
  ]);

  return new SharedProfileForCampaign({
    campaignParticipation,
    campaignAllowsRetry,
    isOrganizationLearnerActive,
    competencesWithArea,
    knowledgeElementsGroupedByCompetenceId,
    userId,
  });
};
