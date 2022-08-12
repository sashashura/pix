// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignFo... Remove this comment to see the full error message
const CampaignForCreation = require('./CampaignForCreation');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignTy... Remove this comment to see the full error message
const CampaignTypes = require('./CampaignTypes');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'UserNotAut... Remove this comment to see the full error message
const { UserNotAuthorizedToCreateCampaignError } = require('../errors');

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignCr... Remove this comment to see the full error message
class CampaignCreator {
  availableTargetProfileIds: $TSFixMe;
  constructor(availableTargetProfileIds: $TSFixMe) {
    this.availableTargetProfileIds = availableTargetProfileIds;
  }

  createCampaign(campaignAttributes: $TSFixMe) {
    const { type, targetProfileId } = campaignAttributes;

    if (type === CampaignTypes.ASSESSMENT) {
      _checkAssessmentCampaignCreatationAllowed(targetProfileId, this.availableTargetProfileIds);
    }

    return new CampaignForCreation(campaignAttributes);
  }
}

function _checkAssessmentCampaignCreatationAllowed(targetProfileId: $TSFixMe, availableTargetProfileIds: $TSFixMe) {
  if (targetProfileId && !availableTargetProfileIds.includes(targetProfileId)) {
    throw new UserNotAuthorizedToCreateCampaignError(
      `Organization does not have an access to the profile ${targetProfileId}`
    );
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignCreator;
