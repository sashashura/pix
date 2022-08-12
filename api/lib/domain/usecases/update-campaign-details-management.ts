// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'campaignVa... Remove this comment to see the full error message
const campaignValidator = require('../validators/campaign-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'EntityVali... Remove this comment to see the full error message
const { EntityValidationError } = require('../errors');

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = async function updateCampaignDetailsManagement({
  campaignId,
  name,
  title,
  customLandingPageText,
  customResultPageText,
  customResultPageButtonText,
  customResultPageButtonUrl,
  multipleSendings,
  campaignManagementRepository
}: $TSFixMe) {
  const campaign = await campaignManagementRepository.get(campaignId);
  campaign.name = name;
  campaign.title = title;
  campaign.customLandingPageText = customLandingPageText;
  campaign.customResultPageText = customResultPageText;
  campaign.customResultPageButtonText = customResultPageButtonText;
  campaign.customResultPageButtonUrl = customResultPageButtonUrl;

  if (multipleSendings !== campaign.multipleSendings && campaign.totalParticipationsCount > 0) {
    throw new EntityValidationError({
      invalidAttributes: [
        { attribute: 'multipleSendings', message: 'CANT_UPDATE_ATTRIBUTE_WHEN_CAMPAIGN_HAS_PARTICIPATIONS' },
      ],
    });
  } else {
    campaign.multipleSendings = multipleSendings;
  }

  campaignValidator.validate(campaign);
  const campaignAttributes = {
    name,
    title,
    customLandingPageText,
    customResultPageText,
    customResultPageButtonText,
    customResultPageButtonUrl,
    multipleSendings: campaign.multipleSendings,
  };
  return campaignManagementRepository.update({ campaignId, campaignAttributes });
};
