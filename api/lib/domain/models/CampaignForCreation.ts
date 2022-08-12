// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'validate'.
const validate = require('../validators/campaign-creation-validator');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'CampaignFo... Remove this comment to see the full error message
class CampaignForCreation {
  code: $TSFixMe;
  creatorId: $TSFixMe;
  customLandingPageText: $TSFixMe;
  idPixLabel: $TSFixMe;
  multipleSendings: $TSFixMe;
  name: $TSFixMe;
  organizationId: $TSFixMe;
  ownerId: $TSFixMe;
  targetProfileId: $TSFixMe;
  title: $TSFixMe;
  type: $TSFixMe;
  constructor({
    name,
    title,
    idPixLabel,
    customLandingPageText,
    type,
    targetProfileId,
    creatorId,
    ownerId,
    organizationId,
    multipleSendings,
    code
  }: $TSFixMe = {}) {
    this.name = name;
    this.title = title;
    this.idPixLabel = idPixLabel;
    this.customLandingPageText = customLandingPageText;
    this.type = type;
    this.targetProfileId = targetProfileId;
    this.creatorId = creatorId;
    this.ownerId = ownerId;
    this.organizationId = organizationId;
    this.multipleSendings = multipleSendings;
    this.code = code;
    validate(this);
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = CampaignForCreation;
