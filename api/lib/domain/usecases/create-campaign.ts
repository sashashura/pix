// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignCo... Remove this comment to see the full error message
const campaignCodeGenerator = require('../services/campaigns/campaign-code-generator');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function createCampaign({
  campaign,
  campaignRepository,
  campaignCreatorRepository
}: $TSFixMe) {
  const generatedCampaignCode = await campaignCodeGenerator.generate(campaignRepository);
  const campaignCreator = await campaignCreatorRepository.get({
    userId: campaign.creatorId,
    organizationId: campaign.organizationId,
    ownerId: campaign.ownerId,
  });

  const campaignForCreation = campaignCreator.createCampaign({ ...campaign, code: generatedCampaignCode });

  return campaignRepository.save(campaignForCreation);
};
